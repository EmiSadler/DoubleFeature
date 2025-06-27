const express = require("express");
const bcrypt = require("bcrypt");
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

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "$2b$10$mockhashedpassword", // This represents a hashed password
  },
];

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (isDevelopmentMode) {
      // Mock registration for development
      const token = jwt.sign(
        { userId: 999, username },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        message: "User created successfully (mock)",
        token,
        user: {
          id: 999,
          username,
          email,
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.User.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const user = await prisma.User.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
