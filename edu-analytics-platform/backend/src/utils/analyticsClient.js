const axios = require("axios");

const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://localhost:8000";

// Sends a student's aggregated performance/engagement stats to the Python
// analytics microservice and returns its risk prediction.
async function predictRisk({ studentId, avgScore, attendanceRate, engagementScore }) {
  const res = await axios.post(`${ANALYTICS_URL}/predict`, {
    student_id: studentId,
    avg_score: avgScore,
    attendance_rate: attendanceRate,
    engagement_score: engagementScore,
  });
  return res.data; // { risk_level, risk_score, reasons }
}

// Asks the analytics service for personalized resource recommendations
// based on a list of identified learning gaps (e.g. ["algebra", "essay-writing"]).
async function getRecommendations(gaps) {
  const res = await axios.post(`${ANALYTICS_URL}/recommend`, { gaps });
  return res.data; // { recommendations: [...] }
}

module.exports = { predictRisk, getRecommendations };
