import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Reverting to the simplest form. With the schema corrected,
// PrismaClient should automatically pick up the DATABASE_URL environment variable.
export const prisma = new PrismaClient();
