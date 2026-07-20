import { prisma } from "../db/prisma.js";

export const DAILY_AI_LIMIT = 5;

const getToday = () => {
  const today = new Date();

  today.setUTCHours(
    0,
    0,
    0,
    0
  );

  return today;
};

export const getAiUsage = async (clerkUserId) => {
  const usageDate = getToday();

  const usage = await prisma.aiUsage.findUnique({
    where: {
      clerkUserId_usageDate: { clerkUserId, usageDate },
    },
  });

  const used = usage?.count ?? 0;

  return {
    used,
    limit: DAILY_AI_LIMIT,
    remaining: Math.max(
      DAILY_AI_LIMIT - used,
      0
    ),
  };
};

export const reserveAiUsage = async (
  clerkUserId
) => {
  const usageDate = getToday();

  const result = await prisma.$transaction(
    async (tx) => {
      await tx.aiUsage.upsert({
        where: {
          clerkUserId_usageDate: { clerkUserId, usageDate },
        },
        update: {},
        create: { clerkUserId, usageDate, count: 0 },
      });

      return tx.aiUsage.updateMany({
        where: {
          clerkUserId,
          usageDate,
          count: { lt: DAILY_AI_LIMIT },
        },
        data: {
          count: { increment: 1 },
        },
      });
    }
  );

  if (result.count === 0) {
    const error = new Error(
      "Daily AI generation limit reached"
    );

    error.statusCode = 429;

    throw error;
  }

  return {
    usageDate,
  };
};

export const refundAiUsage = async ( clerkUserId, usageDate ) => {
  await prisma.aiUsage.updateMany({
    where: {
      clerkUserId,
      usageDate,
      count: { gt: 0 },
    },
    data: {
      count: { decrement: 1 },
    },
  });
};