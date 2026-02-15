import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

/**
 * Middleware для проверки JWT
 */
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * GET all subscriptions
 */
router.get("/", authenticate, async (req: any, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

/**
 * POST create subscription
 */
router.post("/", authenticate, async (req: any, res) => {
  try {
   const { name, price, currency, billingCycle, nextPayment } = req.body;

const newSubscription = await prisma.subscription.create({
  data: {
    name,
    price,
    currency,
    billingCycle,
    nextBillingDate: new Date(nextPayment), // ✅ правильное поле
    userId: req.userId,
  },
});


    res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

/**
 * DELETE subscription
 */
router.delete("/:id", authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    await prisma.subscription.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
