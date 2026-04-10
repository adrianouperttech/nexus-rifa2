import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Explicitly passing the datasource URL to the PrismaClient constructor.
// This is the most reliable way to ensure the client connects correctly.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
