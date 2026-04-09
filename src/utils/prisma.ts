import { PrismaClient } from '@prisma/client';

// Explicitly check for the DATABASE_URL environment variable.
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Explicitly pass the database URL to the Prisma Client constructor.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
