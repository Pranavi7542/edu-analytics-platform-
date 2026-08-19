const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { listCourses, createCourse } = require("../controllers/courseController");

router.get("/", requireAuth, listCourses);
router.post("/", requireAuth, requireRole("faculty", "admin"), createCourse);

module.exports = router;
