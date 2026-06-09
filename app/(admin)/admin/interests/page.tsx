import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { colorMap } from "@/lib/colorMap";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/lib/admin-styles";
import DeleteButton from "@/components/admin/DeleteButton";
import DragSortList from "@/components/admin/DragSortList";
import {
  Heart,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default async function InterestsPage() {
  const interests = await prisma.interest.findMany({
    orderBy: { order: "asc" },
  });

  const activeCount = interests.filter((i) => i.active).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={cn(adminCardBase, "p-5")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">兴趣管理</h1>
              <p className="text-xs text-muted-foreground">
                共 {interests.length} 项 · {activeCount} 项启用 · 拖拽排序
              </p>
            </div>
          </div>
          <Link
            href="/admin/interests/new"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-miku-primary text-primary-foreground",
              "hover:bg-miku-primary-dark transition-colors"
            )}
          >
            <Plus className="w-4 h-4" />
            新建兴趣
          </Link>
        </div>
      </div>

      {/* Content */}
      {interests.length === 0 ? (
        <div className={cn(adminCardBase, "p-12 text-center")}>
          <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">还没有兴趣标签，点击上方按钮创建</p>
          <Link
            href="/admin/interests/new"
            className="text-sm text-miku-primary-dark hover:underline"
          >
            创建兴趣
          </Link>
        </div>
      ) : (
        <DragSortList
          items={interests.map((i) => ({ id: i.id, order: i.order }))}
          reorderApi="/api/interests/reorder"
        >
          {interests.map((interest) => (
            <div key={interest.id} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg flex-shrink-0">{interest.icon}</span>
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {interest.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium flex-shrink-0 ${colorMap[interest.color] || "bg-gray-100 text-gray-700"}`}
                  >
                    {interest.color}
                  </span>
                  {interest.active ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      启用
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground flex-shrink-0">
                      <XCircle className="w-3 h-3" />
                      禁用
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 line-clamp-2">
                  {interest.description}
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[rgba(168,230,225,0.12)] dark:border-[rgba(255,255,255,0.05)]">
                  <Link
                    href={`/admin/interests/${interest.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-miku-primary-dark hover:bg-miku-primary/10 transition-colors"
                  >
                    编辑
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <div className="ml-auto">
                    <DeleteButton apiPath={`/api/interests/${interest.id}`} itemName="兴趣" />
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
