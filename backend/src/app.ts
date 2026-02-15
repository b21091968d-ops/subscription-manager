import express from "express";
import cors from "cors";
import "./config/env";

import authRoutes from "./routes/auth.routes";
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check (для Render)
|--------------------------------------------------------------------------
*/
app.get("/", (_, res) => {
  res.status(200).json({ status: "API is running" });
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
