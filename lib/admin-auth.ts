import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET;
if (!SECRET) throw new Error("ADMIN_SECRET environment variable is required");

function signCookie(value: string): string {
  return createHmac("sha256", SECRET!).update(value).digest("hex");
}

export function signSessionCookie(value: string): string {
  return `${value}.${signCookie(value)}`;
}

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("admin_session")?.value;

  if (!raw) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [value, sig] = raw.split(".");
  if (!value || !sig || value !== "authenticated" || signCookie(value) !== sig) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
