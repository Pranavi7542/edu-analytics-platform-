// Seeds the database with a faculty user, a student user, a course,
// and a few assessments/engagement logs so the dashboards have data to show.
// Run with: npm run seed  (after npm run migrate)
const bcrypt = require("bcryptjs");
const { sequelize, User, Course, Enrollment, Assessment, EngagementLog } = require("../models");

(async () => {
  try {
    await sequelize.sync();

    const passwordHash = await bcrypt.hash("Password123!", 10);

    const [faculty] = await User.findOrCreate({
      where: { email: "faculty@edu.test" },
      defaults: { name: "Dr. Priya Raman", passwordHash, role: "faculty" },
    });

    const [student1] = await User.findOrCreate({
      where: { email: "arjun@edu.test" },
      defaults: { name: "Arjun Kumar", passwordHash, role: "student" },
    });

    const [student2] = await User.findOrCreate({
      where: { email: "sneha@edu.test" },
      defaults: { name: "Sneha Iyer", passwordHash, role: "student" },
    });

    const [course] = await Course.findOrCreate({
      where: { code: "CSA10" },
      defaults: { title: "Software Engineering", program: "B.Tech CSE" },
    });

    await Enrollment.findOrCreate({ where: { studentId: student1.id, courseId: course.id } });
    await Enrollment.findOrCreate({ where: { studentId: student2.id, courseId: course.id } });

    // Arjun: consistently strong performance
    for (const assessment of [
      { title: "Quiz 1", score: 85 },
      { title: "Assignment 1", score: 90 },
      { title: "Midterm", score: 78 },
    ]) {
      await Assessment.findOrCreate({
        where: { title: assessment.title, studentId: student1.id, courseId: course.id },
        defaults: { ...assessment, maxScore: 100, studentId: student1.id, courseId: course.id },
      });
    }
    if ((await EngagementLog.count({ where: { studentId: student1.id } })) === 0) {
      await EngagementLog.bulkCreate([
        { activityType: "login", durationMinutes: 20, studentId: student1.id },
        { activityType: "assignment_submit", durationMinutes: 45, studentId: student1.id },
        { activityType: "attendance", durationMinutes: 60, studentId: student1.id },
      ]);
    }

    // Sneha: declining scores + low engagement -> should be flagged at-risk
    for (const assessment of [
      { title: "Quiz 1", score: 52 },
      { title: "Assignment 1", score: 40 },
      { title: "Midterm", score: 35 },
    ]) {
      await Assessment.findOrCreate({
        where: { title: assessment.title, studentId: student2.id, courseId: course.id },
        defaults: { ...assessment, maxScore: 100, studentId: student2.id, courseId: course.id },
      });
    }
    if ((await EngagementLog.count({ where: { studentId: student2.id } })) === 0) {
      await EngagementLog.create({ activityType: "login", durationMinutes: 5, studentId: student2.id });
    }

    console.log("Seed data created successfully.");
    console.log("Faculty login: faculty@edu.test / Password123!");
    console.log("Student login: arjun@edu.test or sneha@edu.test / Password123!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
