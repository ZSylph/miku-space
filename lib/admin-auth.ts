import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.ADMIN_SECRET;
if (!SECRET) throw new Error("ADMIN_SECRET environment variable is required");

function signCookie(value: string): string {
  return createHmac("sha256", SECRET!).update(value).digest("hex");
}

/** Timing-safe comparison of two hex strings */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

export function signSessionCookie(value: string): string {
  return `${value}.${signCookie(value)}`;
}

export function verifySessionCookie(raw: string | undefined): boolean {
  if (!raw) return false;
  const [value, sig] = raw.split(".");
  if (!value || !sig || value !== "authenticated") return false;
  return safeEqual(signCookie(value), sig);
}

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("admin_session")?.value;

  if (!verifySessionCookie(raw)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
