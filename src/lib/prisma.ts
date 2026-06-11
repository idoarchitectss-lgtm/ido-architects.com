import { PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  // Use DIRECT_URL for adapter (non-pooler) to avoid Neon pooler issues with Prisma
  // Fall back to DATABASE_URL if DIRECT_URL is not set
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

// Singleton pattern — tránh tạo nhiều connections trong dev (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
