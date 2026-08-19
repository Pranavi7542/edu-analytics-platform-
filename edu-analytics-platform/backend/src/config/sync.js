// Creates/updates all tables based on the Sequelize models.
// Run with: npm run migrate  (or: node src/config/sync.js)
const { sequelize } = require("../models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    await sequelize.sync({ alter: true });
    console.log("All tables synced successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to sync database:", err);
    process.exit(1);
  }
})();
