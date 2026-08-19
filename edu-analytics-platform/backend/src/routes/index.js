const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/students", require("./studentRoutes"));
router.use("/courses", require("./courseRoutes"));
router.use("/alerts", require("./alertRoutes"));

module.exports = router;
