import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { FileText, StickyNote, Briefcase, Sparkles, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, noteCount, workCount, interestCount] = await Promise.all([
    prisma.post.count(),
    prisma.note.count(),
    prisma.work.count(),
    prisma.interest.count(),
  ]);

  const stats = [
    { label: "文章", count: postCount, href: "/admin/posts", icon: FileText, color: "text-miku-primary-dark" },
    { label: "笔记", count: noteCount, href: "/admin/notes", icon: StickyNote, color: "text-miku-pink" },
    { label: "作品", count: workCount, href: "/admin/works", icon: Briefcase, color: "text-miku-primary-dark" },
    { label: "兴趣", count: interestCount, href: "/admin/interests", icon: Sparkles, color: "text-miku-pink" },
  ];

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">仪表板</h1>
        <p className="text-sm text-muted-foreground mt-1">
          欢迎回来，查看站点内容概况
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div
              className={cn(
                "rounded-3xl backdrop-blur-xl border p-6",
                "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
