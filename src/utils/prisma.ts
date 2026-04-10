import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Reverting to the simplest form. The error is not here, but likely in the schema
// or the interaction with the generated client.
export const prisma = new PrismaClient();
