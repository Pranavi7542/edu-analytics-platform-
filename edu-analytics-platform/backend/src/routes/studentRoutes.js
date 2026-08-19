const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { listStudents, getStudentPerformance, addAssessment } = require("../controllers/studentController");

router.get("/", requireAuth, requireRole("faculty", "admin"), listStudents);
router.get("/:id/performance", requireAuth, getStudentPerformance);
router.post("/:id/assessments", requireAuth, requireRole("faculty", "admin"), addAssessment);

module.exports = router;
