import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from "@prisma/client/runtime/library";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues
    });
  }

  // Prisma: record not found
  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  // Prisma validation error
  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({
      message: "Database validation error"
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
}
