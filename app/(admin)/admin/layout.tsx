import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="lg:pl-[248px] min-h-screen transition-all duration-300">
        <div className="px-5 sm:px-8 py-6 lg:py-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
