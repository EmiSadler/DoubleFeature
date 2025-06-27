const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const tmdb = require("./routes/tmdb");
const game = require("./routes/game");
const auth = require("./routes/auth");
const scores = require("./routes/scores");

const app = express();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://doublefeature.onrender.com",
          "https://doublefeature-frontend.onrender.com",
        ]
      : [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:4173",
        ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Health check endpoint with database test
app.get("/api/health", async (req, res) => {
  try {
    const isDev =
      process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;

    if (isDev) {
      return res.json({
        status: "ok",
        mode: "development",
        database: "mock",
      });
    }

    // Test database connection
    const { PrismaClient } = require("@prisma/client");
    const testPrisma = new PrismaClient();

    await testPrisma.$connect();
    await testPrisma.$disconnect();

    res.json({
      status: "ok",
      mode: "production",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use("/tmdb", tmdb);
app.use("/game", game);
app.use("/api", auth);
app.use("/api/scores", scores);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = app;
