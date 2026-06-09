import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/lib/admin-styles";
import DeleteButton from "@/components/admin/DeleteButton";
import DragSortList from "@/components/admin/DragSortList";
import {
  Briefcase,
  Plus,
  ArrowUpRight,
  Star,
} from "lucide-react";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { order: "asc" },
  });

  const featuredCount = works.filter((w) => w.featured).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={cn(adminCardBase, "p-5")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">作品管理</h1>
              <p className="text-xs text-muted-foreground">
                共 {works.length} 个作品 · {featuredCount} 个精选 · 拖拽排序
              </p>
            </div>
          </div>
          <Link
            href="/admin/works/new"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-miku-primary text-primary-foreground",
              "hover:bg-miku-primary-dark transition-colors"
            )}
          >
            <Plus className="w-4 h-4" />
            新建作品
          </Link>
        </div>
      </div>

      {/* Content */}
      {works.length === 0 ? (
        <div className={cn(adminCardBase, "p-12 text-center")}>
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">还没有作品，点击上方按钮创建</p>
          <Link
            href="/admin/works/new"
            className="text-sm text-miku-primary-dark hover:underline"
          >
            创建作品
          </Link>
        </div>
      ) : (
        <DragSortList
          items={works.map((w) => ({ id: w.id, order: w.order }))}
          reorderApi="/api/works/reorder"
        >
          {works.map((work) => (
            <div key={work.id} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-foreground truncate">
                    {work.title}
                  </h3>
                  {work.featured && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 flex-shrink-0">
                      <Star className="w-3 h-3" />
                      精选
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mb-1">
                  /{work.slug}
                </p>
                {work.description && (
                  <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-2">
                    {work.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[rgba(168,230,225,0.12)] dark:border-[rgba(255,255,255,0.05)]">
                  <Link
                    href={`/admin/works/${work.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-miku-primary-dark hover:bg-miku-primary/10 transition-colors"
                  >
                    编辑
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <div className="ml-auto">
                    <DeleteButton apiPath={`/api/works/${work.id}`} itemName="作品" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </DragSortList>
      )}
    </div>
  );
}
