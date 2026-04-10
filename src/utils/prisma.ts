import { PrismaClient } from '@prisma/client';

// This is a global singleton to ensure only one instance of PrismaClient is created.
// The key is to instantiate it lazily, not when the module is loaded.
let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("CRITICAL: DATABASE_URL environment variable is not set.");
    }
    prisma = new PrismaClient();
  }
  return prisma;
}
