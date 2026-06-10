import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { colorMap } from "@/lib/colorMap";
import AdminListHeader from "@/components/admin/AdminListHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import DeleteButton from "@/components/admin/DeleteButton";
import DragSortList from "@/components/admin/DragSortList";
import {
  Heart,
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
      <AdminListHeader
        icon={<Heart className="w-5 h-5 text-rose-500" />}
        iconClassName="bg-rose-500/10 dark:bg-rose-500/15"
        title="兴趣管理"
        subtitle={`共 ${interests.length} 项 · ${activeCount} 项启用 · 拖拽排序`}
        actionHref="/admin/interests/new"
        actionLabel="新建兴趣"
      />

      {interests.length === 0 ? (
        <AdminEmptyState
          icon={<Heart className="w-10 h-10" />}
          message="还没有兴趣标签，点击上方按钮创建"
          actionHref="/admin/interests/new"
          actionLabel="创建兴趣"
        />
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
