import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/admin-auth";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!verifySessionCookie(session)) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
