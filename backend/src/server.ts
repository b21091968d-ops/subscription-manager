import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import subscriptionRoutes from "./routes/subscription.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * CORS configuration
 * CLIENT_URL должен быть задан в Render
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/", (_req, res) => {
  res.json({ message: "API is running 🚀" });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
