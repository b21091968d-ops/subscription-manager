import { z } from "zod";

/**
 * CREATE subscription schema
 */
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().optional().default("USD"),
  billingDay: z
    .number()
    .int("Billing day must be an integer")
    .min(1)
    .max(31),
});

/**
 * UPDATE subscription schema
 */
export const updateSubscriptionSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  billingDay: z.number().int().min(1).max(31).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Query schema (pagination + filters)
 */
export const subscriptionQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  active: z.enum(["true", "false"]).optional(),
});
