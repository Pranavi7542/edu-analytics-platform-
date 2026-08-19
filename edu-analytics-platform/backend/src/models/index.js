const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// ---------- User (login for students & faculty) ----------
const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("student", "faculty", "admin"), defaultValue: "student" },
});

// ---------- Course ----------
const Course = sequelize.define("Course", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  program: { type: DataTypes.STRING },
});

// ---------- Enrollment (links a student User to a Course) ----------
const Enrollment = sequelize.define("Enrollment", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
});

// ---------- Assessment (a score for a student in a course) ----------
const Assessment = sequelize.define("Assessment", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.FLOAT, allowNull: false },
  maxScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 100 },
  takenAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// ---------- Engagement log (attendance / LMS activity events) ----------
const EngagementLog = sequelize.define("EngagementLog", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  activityType: {
    type: DataTypes.ENUM("login", "assignment_submit", "video_view", "forum_post", "attendance"),
    allowNull: false,
  },
  durationMinutes: { type: DataTypes.FLOAT, defaultValue: 0 },
  occurredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// ---------- Alert (raised when the analytics engine flags a student as at-risk) ----------
const Alert = sequelize.define("Alert", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  riskLevel: { type: DataTypes.ENUM("low", "medium", "high"), allowNull: false },
  riskScore: { type: DataTypes.FLOAT, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// ---------- Associations ----------
User.hasMany(Enrollment, { foreignKey: "studentId" });
Course.hasMany(Enrollment, { foreignKey: "courseId" });
Enrollment.belongsTo(User, { foreignKey: "studentId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(Assessment, { foreignKey: "studentId" });
Course.hasMany(Assessment, { foreignKey: "courseId" });
Assessment.belongsTo(User, { foreignKey: "studentId" });
Assessment.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(EngagementLog, { foreignKey: "studentId" });
EngagementLog.belongsTo(User, { foreignKey: "studentId" });

User.hasMany(Alert, { foreignKey: "studentId" });
Alert.belongsTo(User, { foreignKey: "studentId" });

module.exports = { sequelize, User, Course, Enrollment, Assessment, EngagementLog, Alert };
