import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

export const prisma = new PrismaClient();
