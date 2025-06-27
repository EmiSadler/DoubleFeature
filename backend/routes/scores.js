const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Save game score
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { score, gameMode, moviesUsed } = req.body;
    const userId = req.user.userId;

    const gameScore = await prisma.gameScore.create({
      data: {
        userId,
        score,
        gameMode,
        moviesUsed,
      },
    });

    res.status(201).json({
      message: "Score saved successfully",
      gameScore,
    });
  } catch (error) {
    console.error("Save score error:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Get user's scores
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const scores = await prisma.gameScore.findMany({
      where: { userId },
      orderBy: { playedAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    res.json(scores);
  } catch (error) {
    console.error("Get scores error:", error);
    res.status(500).json({ error: "Failed to retrieve scores" });
  }
});

// Get leaderboard (top scores)
router.get("/leaderboard", async (req, res) => {
  try {
    const { gameMode = "easy", limit = 10 } = req.query;

    const topScores = await prisma.gameScore.findMany({
      where: { gameMode },
      orderBy: [
        { score: "desc" },
        { playedAt: "asc" }, // Earlier score wins in case of tie
      ],
      take: parseInt(limit),
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    res.json(topScores);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
});

module.exports = router;
