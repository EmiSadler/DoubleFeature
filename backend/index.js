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
app.use(cors());
app.use(express.json());

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const isEmail = usernameOrEmail.includes("@");

  // Find user by either email or username
  const user = await prisma.user.findUnique({
    where: isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
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
});

// Protected route
app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
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

    const gameScore = await prisma.gameScore.create({
      data: {
        userId: decoded.id,
        score,
        gameMode,
        moviesUsed: JSON.stringify(moviesUsed),
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

    const scores = await prisma.gameScore.findMany({
      where: { userId: decoded.id },
      orderBy: { score: "desc" },
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
    const leaderboard = await prisma.gameScore.findMany({
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

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle requests by serving index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// API endpoint
app.use("/api/products", async (req, res) => {
  const response = await axios.get("https://double-feature.vercel.app");
  res.send(response.data);
});

app.use("/tmdb", require("./routes/tmdb"));
app.use("/game", require("./routes/game"));

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
