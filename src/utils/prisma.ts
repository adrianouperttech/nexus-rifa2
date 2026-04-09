import { PrismaClient } from '@prisma/client';

// With Prisma 7+, the database URL is passed directly to the client constructor,
// as the `url` field in the schema is deprecated.
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

export const prisma = new PrismaClient({
  datasourceUrls: {
    db: process.env.DATABASE_URL,
  },
});
