import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// For Prisma 7+, the database URL is passed directly to the constructor
// using the `datasourceUrl` property.
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
