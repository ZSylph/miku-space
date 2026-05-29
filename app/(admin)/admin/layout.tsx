import AdminNavbar from "@/components/layout/AdminNavbar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-h-screen",
        "bg-[#FFF5F7] dark:bg-[#0D0D1A]"
      )}
    >
      <AdminNavbar />
      <main className="container py-8">{children}</main>
    </div>
  );
}
