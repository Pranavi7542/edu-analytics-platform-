const { Course } = require("../models");

// GET /api/courses
async function listCourses(req, res, next) {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

// POST /api/courses  (faculty only)
async function createCourse(req, res, next) {
  try {
    const { code, title, program } = req.body;
    if (!code || !title) return res.status(400).json({ error: "code and title are required." });

    const course = await Course.create({ code, title, program });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCourses, createCourse };
