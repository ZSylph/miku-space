import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [postCount, noteCount, workCount, interestCount] = await Promise.all([
    prisma.post.count(),
    prisma.note.count(),
    prisma.work.count(),
    prisma.interest.count(),
  ]);

  const stats = [
    { label: "文章", count: postCount, href: "/admin/posts" },
    { label: "笔记", count: noteCount, href: "/admin/notes" },
    { label: "作品", count: workCount, href: "/admin/works" },
    { label: "兴趣", count: interestCount, href: "/admin/interests" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">仪表板</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
