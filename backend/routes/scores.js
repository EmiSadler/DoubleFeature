const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Check if we're in development mode without database
const isDevelopmentMode =
  process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;

console.log("Scores routes - Development mode:", isDevelopmentMode);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

let prisma = null;
if (!isDevelopmentMode) {
  try {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
    console.log("Prisma client initialized successfully");
  } catch (error) {
    console.warn("Prisma client initialization failed:", error.message);
  }
}

// Mock data for development
const mockScores = [
  {
    id: 1,
    score: 15,
    gameMode: "easy",
    playedAt: new Date(),
    user: { username: "TestPlayer1" },
  },
  {
    id: 2,
    score: 12,
    gameMode: "easy",
    playedAt: new Date(),
    user: { username: "TestPlayer2" },
  },
  {
    id: 3,
    score: 8,
    gameMode: "hard",
    playedAt: new Date(),
    user: { username: "TestPlayer3" },
  },
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "dev-secret", (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ error: "Invalid token" });
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

    console.log("Saving score:", {
      score,
      gameMode,
      userId,
      isDevelopmentMode,
    });

    // Validate input
    if (!score || !gameMode) {
      return res
        .status(400)
        .json({ error: "Score and game mode are required" });
    }

    if (isDevelopmentMode) {
      // Mock save for development
      const mockGameScore = {
        id: Date.now(),
        score,
        gameMode,
        moviesUsed,
        userId,
        playedAt: new Date(),
        user: { username: req.user.username || "MockUser" },
      };

      console.log("Mock score saved:", mockGameScore);
      return res.status(201).json({
        message: "Score saved successfully (mock)",
        gameScore: mockGameScore,
      });
    }

    if (!prisma) {
      console.error("Prisma client not available");
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const gameScore = await prisma.GameScore.create({
      data: {
        score: parseInt(score),
        gameMode,
        moviesUsed: moviesUsed || [],
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("Score saved to database:", gameScore);
    res.status(201).json({
      message: "Score saved successfully",
      gameScore,
    });
  } catch (error) {
    console.error("Save score error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Get user's scores
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Getting user scores for userId:", userId);

    if (isDevelopmentMode) {
      // Return mock data for development
      const userScores = mockScores.filter(() => Math.random() > 0.3); // Random subset
      console.log("Returning mock user scores:", userScores);
      return res.json(userScores);
    }

    if (!prisma) {
      console.error("Prisma client not available");
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const scores = await prisma.GameScore.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { playedAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("User scores retrieved:", scores.length);
    res.json(scores);
  } catch (error) {
    console.error("Get user scores error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    res.status(500).json({ error: "Failed to retrieve user scores" });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { gameMode = "easy", limit = 10 } = req.query;

    console.log("Leaderboard request:", { gameMode, limit, isDevelopmentMode });

    if (isDevelopmentMode) {
      // Return mock data for development
      const filteredScores = mockScores
        .filter((score) => score.gameMode === gameMode)
        .sort((a, b) => b.score - a.score)
        .slice(0, parseInt(limit));

      console.log("Returning mock leaderboard:", filteredScores);
      return res.json(filteredScores);
    }

    if (!prisma) {
      console.error("Prisma client not initialized");
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const topScores = await prisma.GameScore.findMany({
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

    console.log("Leaderboard retrieved:", topScores.length, "scores");
    res.json(topScores);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
});

// Get all scores (admin endpoint)
router.get("/all", async (req, res) => {
  try {
    console.log("Getting all scores");

    if (isDevelopmentMode) {
      console.log("Returning mock scores for all");
      return res.json(mockScores);
    }

    if (!prisma) {
      console.error("Prisma client not available");
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const allScores = await prisma.GameScore.findMany({
      orderBy: [{ score: "desc" }, { playedAt: "asc" }],
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("All scores retrieved:", allScores.length);
    res.json(allScores);
  } catch (error) {
    console.error("Get all scores error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    res.status(500).json({ error: "Failed to retrieve all scores" });
  }
});

module.exports = router;
