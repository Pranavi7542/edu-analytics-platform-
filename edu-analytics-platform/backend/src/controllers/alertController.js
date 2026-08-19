const { Alert, User } = require("../models");

// GET /api/alerts  (faculty only) - list unresolved at-risk alerts
async function listAlerts(req, res, next) {
  try {
    const alerts = await Alert.findAll({
      where: { resolved: false },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/alerts/:id/resolve  (faculty only)
async function resolveAlert(req, res, next) {
  try {
    const { id } = req.params;
    const alert = await Alert.findByPk(id);
    if (!alert) return res.status(404).json({ error: "Alert not found." });

    alert.resolved = true;
    await alert.save();
    res.json(alert);
  } catch (err) {
    next(err);
  }
}

module.exports = { listAlerts, resolveAlert };
