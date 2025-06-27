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
  origin: process.env.NODE_ENV === "production" 
    ? ["https://doublefeature.onrender.com", "https://doublefeature-frontend.onrender.com"]
    : ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    await prisma.$disconnect();
    
    res.status(200).json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      database: "connected"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ 
      status: "error", 
      database: "disconnected",
      error: error.message 
    });
  }
});

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: { username, email, password: hash },
    });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find user by either email or username
    const user = await prisma.User.findFirst({
      where: {
        OR: [
          { email: usernameOrEmail },
          { username: usernameOrEmail }
        ]
      }
    });

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route
app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.User.findUnique({ where: { id: decoded.id } });
    res.json({ username: user.username });
  } catch (err) {
    res.sendStatus(401);
  }
});

// Save game score (requires authentication)
app.post("/api/scores", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { score, gameMode, moviesUsed } = req.body;

    const gameScore = await prisma.GameScore.create({
      data: {
        userId: decoded.id,
        score,
        gameMode,
        moviesUsed: moviesUsed || [],
      },
    });

    res.status(201).json(gameScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Get user's scores (requires authentication)
app.get("/api/scores/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const scores = await prisma.GameScore.findMany({
      where: { userId: decoded.id },
      orderBy: { score: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// Get global leaderboard
app.get("/api/scores/leaderboard", async (req, res) => {
  try {
    const leaderboard = await prisma.GameScore.findMany({
      select: {
        id: true,
        score: true,
        gameMode: true,
        playedAt: true,
        user: { select: { username: true } },
      },
      orderBy: { score: "desc" },
      take: 100,
    });

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Route imports
app.use("/tmdb", require("./routes/tmdb"));
app.use("/game", require("./routes/game"));

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
