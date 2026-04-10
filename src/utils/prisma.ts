import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Correctly instantiate the Prisma Client by programmatically setting the database URL.
// The correct property is `datasources`, not `datasourceUrls`.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
