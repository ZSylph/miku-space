import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted">
      <AdminNavbar />
      <main className="container py-8">{children}</main>
    </div>
  );
}
