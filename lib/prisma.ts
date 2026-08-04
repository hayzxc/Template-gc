import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";

  let pool: Pool;
  try {
    if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
      const url = new URL(dbUrl);
      pool = new Pool({
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        host: url.hostname,
        port: Number(url.port) || 5432,
        database: url.pathname.slice(1),
      });
    } else {
      pool = new Pool({ connectionString: dbUrl });
    }
  } catch {
    pool = new Pool({ connectionString: dbUrl });
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
