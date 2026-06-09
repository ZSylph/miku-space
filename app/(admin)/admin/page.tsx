import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/lib/admin-styles";
import {
  FileText,
  StickyNote,
  Briefcase,
  Heart,
  ArrowRight,
  Clock,
  BarChart3,
  Layers,
} from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, noteCount, workCount, interestCount, recentPosts, recentNotes] =
    await Promise.all([
      prisma.post.count(),
      prisma.note.count(),
      prisma.work.count(),
      prisma.interest.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, published: true, updatedAt: true },
      }),
      prisma.note.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, published: true, updatedAt: true },
      }),
    ]);

  const totalContent = postCount + noteCount + workCount + interestCount;

  const stats = [
    {
      label: "文章",
      value: postCount,
      icon: FileText,
      href: "/admin/posts",
      color: "text-blue-500",
      bgLight: "bg-blue-500/10",
      bgDark: "dark:bg-blue-500/15",
    },
    {
      label: "笔记",
      value: noteCount,
      icon: StickyNote,
      href: "/admin/notes",
      color: "text-emerald-500",
      bgLight: "bg-emerald-500/10",
      bgDark: "dark:bg-emerald-500/15",
    },
    {
      label: "作品",
      value: workCount,
      icon: Briefcase,
      href: "/admin/works",
      color: "text-violet-500",
      bgLight: "bg-violet-500/10",
      bgDark: "dark:bg-violet-500/15",
    },
    {
      label: "兴趣",
      value: interestCount,
      icon: Heart,
      href: "/admin/interests",
      color: "text-rose-500",
      bgLight: "bg-rose-500/10",
      bgDark: "dark:bg-rose-500/15",
    },
  ];

  const allRecent = [
    ...recentPosts.map((p) => ({
      ...p,
      type: "文章" as const,
      href: `/admin/posts/${p.id}/edit`,
    })),
    ...recentNotes.map((n) => ({
      ...n,
      type: "笔记" as const,
      href: `/admin/notes/${n.id}/edit`,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(adminCardBase, "p-6")}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-miku-primary to-miku-pink flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">仪表盘</h1>
            <p className="text-sm text-muted-foreground">Miku Space 管理概览</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={cn(
                adminCardBase,
                "p-4 group hover:-translate-y-0.5 transition-all duration-200"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    stat.bgLight,
                    stat.bgDark
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5", stat.color)} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
              </div>
              <div className="text-[28px] font-bold text-foreground leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions + Total */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Total content card */}
        <div className={cn(adminCardBase, "p-5 flex items-center gap-4")}>
          <div className="w-11 h-11 rounded-xl bg-miku-primary/10 dark:bg-miku-primary/15 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-miku-primary-dark" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{totalContent}</div>
            <div className="text-xs text-muted-foreground">内容总数</div>
          </div>
        </div>

        {/* Quick action shortcuts */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "新建文章", href: "/admin/posts/new", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/15" },
            { label: "新建笔记", href: "/admin/notes/new", icon: StickyNote, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/15" },
            { label: "新建作品", href: "/admin/works/new", icon: Briefcase, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/15" },
            { label: "新建兴趣", href: "/admin/interests/new", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10 dark:bg-rose-500/15" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={cn(
                  adminCardBase,
                  "p-4 flex flex-col items-center justify-center gap-2 text-center group hover:-translate-y-0.5 transition-all duration-200"
                )}
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", action.bg)}>
                  <Icon className={cn("w-4.5 h-4.5", action.color)} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={cn(adminCardBase, "p-5")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">最近更新</h2>
          </div>
        </div>

        {allRecent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">暂无内容，使用上方快捷入口创建</p>
        ) : (
          <div className="space-y-2">
            {allRecent.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[rgba(168,230,225,0.08)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-medium",
                    item.type === "文章"
                      ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/15"
                      : "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15"
                  )}
                >
                  {item.type === "文章" ? (
                    <FileText className="w-3.5 h-3.5" />
                  ) : (
                    <StickyNote className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.type} · {new Date(item.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
