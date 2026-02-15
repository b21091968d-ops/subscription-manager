import prisma from "../../config/prisma";

/**
 * CREATE
 */
export async function createSubscription(
  data: {
    name: string;
    price: number;
    currency: string;
    billingCycle: string;
    nextBillingDate: string;
  },
  userId: string
) {
  return prisma.subscription.create({
    data: {
      name: data.name,
      price: data.price,
      currency: data.currency,
      billingCycle: data.billingCycle,
      nextBillingDate: new Date(data.nextBillingDate),
      user: {
        connect: { id: userId }
      }
    }
  });
}

/**
 * GET
 */
export async function getSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * UPDATE  ✅ НОВОЕ
 */
export async function updateSubscription(
  id: number,
  data: {
    name: string;
    price: number;
    currency: string;
    billingCycle: string;
    nextBillingDate: string;
  },
  userId: string
) {
  // Проверяем, что подписка принадлежит пользователю
  const existing = await prisma.subscription.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    throw new Error("Subscription not found");
  }

  return prisma.subscription.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      currency: data.currency,
      billingCycle: data.billingCycle,
      nextBillingDate: new Date(data.nextBillingDate)
    }
  });
}

/**
 * DELETE
 */
export async function deleteSubscription(
  id: number,
  userId: string
) {
  const existing = await prisma.subscription.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    throw new Error("Subscription not found");
  }

  return prisma.subscription.delete({
    where: { id }
  });
}
