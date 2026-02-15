import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    req.userId = decoded.userId; // ← ЭТО ДОЛЖНО СОВПАДАТЬ

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
