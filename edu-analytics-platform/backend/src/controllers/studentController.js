const { User, Assessment, EngagementLog, Course, Alert } = require("../models");
const { predictRisk } = require("../utils/analyticsClient");

// GET /api/students  (faculty only)
async function listStudents(req, res, next) {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "name", "email"],
    });
    res.json(students);
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id/performance
// Aggregates a student's assessment scores + engagement into a summary,
// used by both the student's own dashboard and the faculty dashboard.
async function getStudentPerformance(req, res, next) {
  try {
    const { id } = req.params;

    const assessments = await Assessment.findAll({
      where: { studentId: id },
      include: [{ model: Course, attributes: ["title", "code"] }],
      order: [["takenAt", "ASC"]],
    });

    const engagementLogs = await EngagementLog.findAll({ where: { studentId: id } });

    const avgScore = assessments.length
      ? assessments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / assessments.length
      : 0;

    const attendanceEvents = engagementLogs.filter((e) => e.activityType === "attendance").length;
    const attendanceRate = engagementLogs.length ? (attendanceEvents / engagementLogs.length) * 100 : 0;
    const engagementScore = engagementLogs.reduce((sum, e) => sum + e.durationMinutes, 0);

    res.json({
      studentId: id,
      avgScore: Math.round(avgScore * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      engagementScore,
      assessments,
      engagementLogs,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/students/:id/assessments  (faculty only)
// Records a new assessment score, then immediately asks the analytics
// engine whether this student should be flagged as at-risk.
async function addAssessment(req, res, next) {
  try {
    const { id } = req.params;
    const { title, score, maxScore, courseId } = req.body;

    if (!title || score === undefined || !courseId) {
      return res.status(400).json({ error: "title, score and courseId are required." });
    }

    const assessment = await Assessment.create({
      title,
      score,
      maxScore: maxScore || 100,
      studentId: id,
      courseId,
    });

    // Recompute the student's rolling averages and consult the analytics engine.
    const perfReq = { params: { id } };
    let riskResult = null;
    try {
      const allAssessments = await Assessment.findAll({ where: { studentId: id } });
      const allEngagement = await EngagementLog.findAll({ where: { studentId: id } });
      const avgScore = allAssessments.length
        ? allAssessments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / allAssessments.length
        : 0;
      const attendanceEvents = allEngagement.filter((e) => e.activityType === "attendance").length;
      const attendanceRate = allEngagement.length ? (attendanceEvents / allEngagement.length) * 100 : 0;
      const engagementScore = allEngagement.reduce((sum, e) => sum + e.durationMinutes, 0);

      riskResult = await predictRisk({ studentId: id, avgScore, attendanceRate, engagementScore });

      if (riskResult.risk_level === "high" || riskResult.risk_level === "medium") {
        await Alert.create({
          studentId: id,
          riskLevel: riskResult.risk_level,
          riskScore: riskResult.risk_score,
          message: `Auto-flagged after "${title}": avg score ${avgScore.toFixed(1)}%, risk ${riskResult.risk_level}.`,
        });
      }
    } catch (analyticsErr) {
      // The analytics service being temporarily unavailable should not fail the write.
      console.warn("Analytics engine unreachable, skipping risk check:", analyticsErr.message);
    }

    res.status(201).json({ assessment, risk: riskResult });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStudents, getStudentPerformance, addAssessment };
