import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET;
if (!SECRET) throw new Error("ADMIN_SECRET environment variable is required");

function signCookie(value: string): string {
  return createHmac("sha256", SECRET!).update(value).digest("hex");
}

function verifyCookie(raw: string | undefined): boolean {
  if (!raw) return false;
  const [value, sig] = raw.split(".");
  if (!value || !sig || value !== "authenticated") return false;
  return signCookie(value) === sig;
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!verifyCookie(session)) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
