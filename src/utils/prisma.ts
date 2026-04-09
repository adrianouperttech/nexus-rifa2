import { PrismaClient } from '@prisma/client';

// Explicitly check for the DATABASE_URL environment variable.
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Explicitly pass the database URL to the Prisma Client constructor using the correct 'datasourceUrls' property.
export const prisma = new PrismaClient({
  datasourceUrls: {
    db: process.env.DATABASE_URL,
  },
});
