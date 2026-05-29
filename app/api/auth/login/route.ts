import "dotenv/config";
import { verifyCredentials } from "@/lib/auth";
import { signSessionCookie } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const isValid = verifyCredentials(username, password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", signSessionCookie("authenticated"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
