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
 * Convenience re-export for local development and build-time codegen.
 *
 * ⚠️  In production (Cloudflare Workers), this proxy delegates to `getPrisma()`
 *     on every property access, ensuring the correct per-request D1 binding
 *     is used. However, because it is a Proxy, some operations do not work
 *     as expected:
 *
 *     - `prisma instanceof PrismaClient` → false
 *     - `Object.keys(prisma)` → empty array
 *     - `prisma.$extends(...)` → may not behave correctly
 *
 *     For production route handlers, prefer `const p = getPrisma()` and use
 *     the returned instance directly.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma(), prop, receiver);
  },
  has(_target, prop) {
    return Reflect.has(getPrisma(), prop);
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getPrisma(), prop);
  },
  ownKeys() {
    return Reflect.ownKeys(getPrisma());
  },
});
