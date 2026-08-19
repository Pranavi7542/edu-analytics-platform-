require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check used by Docker HEALTHCHECK / docker-compose depends_on
app.get("/health", (req, res) => res.json({ status: "ok", service: "backend" }));

app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EduAnalytics backend listening on port ${PORT}`);
});
