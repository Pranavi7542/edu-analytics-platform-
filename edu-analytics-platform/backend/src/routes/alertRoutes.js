const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { listAlerts, resolveAlert } = require("../controllers/alertController");

router.get("/", requireAuth, requireRole("faculty", "admin"), listAlerts);
router.patch("/:id/resolve", requireAuth, requireRole("faculty", "admin"), resolveAlert);

module.exports = router;
