require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
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

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
