import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/* ──────────────────────────────────────────────
 *  Cloudflare Workers bindings helper
 * ────────────────────────────────────────────── */

interface CloudflareBindings {
  DB: unknown; // D1Database
  R2: unknown; // R2Bucket
  [key: string]: unknown;
}

/**
 * Access Cloudflare Workers bindings & secrets.
 * Returns null in local development (next dev) and at build time.
 */
export function getCloudflareEnv(): CloudflareBindings | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (typeof g.getRequestContext !== "function") return null;
  try {
    return g.getRequestContext().env as CloudflareBindings;
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────
 *  Prisma Client (D1 in production, SQLite in dev/build)
 * ────────────────────────────────────────────── */

// Cache per D1 binding in production (WeakMap avoids leaking across isolates)
const d1ClientMap = new WeakMap<object, PrismaClient>();
// Singleton for local development and build-time SSG
let localClient: PrismaClient | null = null;

function getLocalClient(): PrismaClient {
  if (!localClient) {
    const url = process.env.DATABASE_URL || "file:./dev.db";
    const adapter = new PrismaBetterSqlite3({ url });
    localClient = new PrismaClient({ adapter });
  }
  return localClient;
}

export function getPrisma(): PrismaClient {
  const cf = getCloudflareEnv();

  if (cf?.DB) {
    const binding = cf.DB as object;
    let client = d1ClientMap.get(binding);
    if (!client) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client = new PrismaClient({ adapter: new PrismaD1(cf.DB as any) });
      d1ClientMap.set(binding, client);
    }
    return client;
  }

  return getLocalClient();
}

/**
 * Backwards-compatible named export.
 * In local dev this returns the singleton PrismaClient.
 * In production callers should prefer getPrisma() so the
 * correct D1 binding is used per-request.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma(), prop, receiver);
  },
});
