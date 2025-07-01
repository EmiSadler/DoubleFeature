require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://doublefeature.emisadler.com"]
      : [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:4173",
          "http://localhost:4000",
        ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Origin:", req.headers.origin);
  next();
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    await prisma.$disconnect();

    res.status(200).json({
      status: "ok",
      env: process.env.NODE_ENV,
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

// Route imports
app.use("/tmdb", require("./routes/tmdb"));
app.use("/game", require("./routes/game"));
app.use("/api", require("./routes/auth"));
app.use("/api/scores", require("./routes/scores"));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 404 Handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Handle requests by serving index.html for all routes (SPA)
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../frontend/dist", "index.html");
  if (require("fs").existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Frontend build not found" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
