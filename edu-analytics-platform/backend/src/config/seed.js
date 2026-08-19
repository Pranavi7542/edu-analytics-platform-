// Seeds the database with a faculty user, a student user, a course,
// and a few assessments/engagement logs so the dashboards have data to show.
// Run with: npm run seed  (after npm run migrate)
const bcrypt = require("bcryptjs");
const { sequelize, User, Course, Enrollment, Assessment, EngagementLog } = require("../models");

(async () => {
  try {
    await sequelize.sync();

    const passwordHash = await bcrypt.hash("Password123!", 10);

    const faculty = await User.create({
      name: "Dr. Priya Raman",
      email: "faculty@edu.test",
      passwordHash,
      role: "faculty",
    });

    const student1 = await User.create({
      name: "Arjun Kumar",
      email: "arjun@edu.test",
      passwordHash,
      role: "student",
    });

    const student2 = await User.create({
      name: "Sneha Iyer",
      email: "sneha@edu.test",
      passwordHash,
      role: "student",
    });

    const course = await Course.create({
      code: "CSA10",
      title: "Software Engineering",
      program: "B.Tech CSE",
    });

    await Enrollment.create({ studentId: student1.id, courseId: course.id });
    await Enrollment.create({ studentId: student2.id, courseId: course.id });

    // Arjun: consistently strong performance
    await Assessment.bulkCreate([
      { title: "Quiz 1", score: 85, maxScore: 100, studentId: student1.id, courseId: course.id },
      { title: "Assignment 1", score: 90, maxScore: 100, studentId: student1.id, courseId: course.id },
      { title: "Midterm", score: 78, maxScore: 100, studentId: student1.id, courseId: course.id },
    ]);
    await EngagementLog.bulkCreate([
      { activityType: "login", durationMinutes: 20, studentId: student1.id },
      { activityType: "assignment_submit", durationMinutes: 45, studentId: student1.id },
      { activityType: "attendance", durationMinutes: 60, studentId: student1.id },
    ]);

    // Sneha: declining scores + low engagement -> should be flagged at-risk
    await Assessment.bulkCreate([
      { title: "Quiz 1", score: 52, maxScore: 100, studentId: student2.id, courseId: course.id },
      { title: "Assignment 1", score: 40, maxScore: 100, studentId: student2.id, courseId: course.id },
      { title: "Midterm", score: 35, maxScore: 100, studentId: student2.id, courseId: course.id },
    ]);
    await EngagementLog.bulkCreate([
      { activityType: "login", durationMinutes: 5, studentId: student2.id },
    ]);

    console.log("Seed data created successfully.");
    console.log("Faculty login: faculty@edu.test / Password123!");
    console.log("Student login: arjun@edu.test or sneha@edu.test / Password123!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
