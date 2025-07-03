const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Check if we're in development mode without database
const isDevelopmentMode =
  process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;

let prisma = null;
if (!isDevelopmentMode) {
  try {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
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

      return res.status(201).json({
        message: "Score saved successfully (mock)",
        gameScore: mockGameScore,
      });
    }

    if (!prisma) {
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

    res.status(201).json({
      message: "Score saved successfully",
      gameScore,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Get user's scores
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (isDevelopmentMode) {
      // Return mock data for development
      const userScores = mockScores.filter(() => Math.random() > 0.3); // Random subset
      return res.json(userScores);
    }

    if (!prisma) {
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

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user scores" });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { gameMode = "easy", limit = 10 } = req.query;

    if (isDevelopmentMode) {
      // Return mock data for development
      const filteredScores = mockScores
        .filter((score) => score.gameMode === gameMode)
        .sort((a, b) => b.score - a.score)
        .slice(0, parseInt(limit));

      return res.json(filteredScores);
    }

    if (!prisma) {
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

    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
});

// Get all scores (admin endpoint)
router.get("/all", async (req, res) => {
  try {
    if (isDevelopmentMode) {
      return res.json(mockScores);
    }

    if (!prisma) {
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

    res.json(allScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve all scores" });
  }
});

module.exports = router;
