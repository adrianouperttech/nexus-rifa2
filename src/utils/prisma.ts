import { PrismaClient } from '@prisma/client';

// The Prisma Client will automatically read the DATABASE_URL environment variable.
// We can add a check to ensure it's set.
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
}

// Instantiate the Prisma Client without any arguments.
// It will use the `url` from the `datasource` block in your `schema.prisma`,
// which should be set to `env("DATABASE_URL")`.
export const prisma = new PrismaClient();
