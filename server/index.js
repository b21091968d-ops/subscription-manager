import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dev_secret_change_later";

const app = express();
app.use(cors());
app.use(express.json());

let db;

// ===== AUTH MIDDLEWARE =====
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ===== INIT DB =====
(async () => {
  db = await open({
    filename: "./subscriptions.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      period TEXT,
      user_id INTEGER
    );
  `);

  console.log("Database ready");
})();

// ===== HEALTH =====
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ===== REGISTER =====
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );
    res.json({ id: result.lastID, email });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});

// ===== LOGIN (TOKEN) =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.get(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// ===== PROTECTED API =====
app.get("/api/subscriptions", authMiddleware, async (req, res) => {
  const rows = await db.all(
    "SELECT * FROM subscriptions WHERE user_id = ?",
    [req.userId]
  );
  res.json(rows);
});

app.post("/api/subscriptions", authMiddleware, async (req, res) => {
  const { name, price, period } = req.body;

  if (!name || !price || !period) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const result = await db.run(
    "INSERT INTO subscriptions (name, price, period, user_id) VALUES (?, ?, ?, ?)",
    [name, price, period, req.userId]
  );

  res.status(201).json({
    id: result.lastID,
    name,
    price,
    period,
  });
});

// ===== START =====
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
