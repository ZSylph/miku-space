import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import AdminListHeader from "@/components/admin/AdminListHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import DeleteButton from "@/components/admin/DeleteButton";
import DragSortList from "@/components/admin/DragSortList";
import {
  StickyNote,
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    orderBy: { order: "asc" },
  });

  const publishedCount = notes.filter((n) => n.published).length;
  const draftCount = notes.length - publishedCount;
  const allTags = notes.flatMap((n) => parseTags(n.tags));
  const uniqueTags = [...new Set(allTags)];

  return (
    <div className="space-y-5">
      <AdminListHeader
        icon={<StickyNote className="w-5 h-5 text-emerald-500" />}
        iconClassName="bg-emerald-500/10 dark:bg-emerald-500/15"
        title="笔记管理"
        subtitle={`共 ${notes.length} 篇 · ${publishedCount} 已发布 · ${draftCount} 草稿${uniqueTags.length > 0 ? ` · ${uniqueTags.length} 个标签` : ""} · 拖拽排序`}
        actionHref="/admin/notes/new"
        actionLabel="新建笔记"
      />

      {notes.length === 0 ? (
        <AdminEmptyState
          icon={<StickyNote className="w-10 h-10" />}
          message="还没有笔记，点击上方按钮创建"
          actionHref="/admin/notes/new"
          actionLabel="创建笔记"
        />
      ) : (
        <DragSortList
          items={notes.map((n) => ({ id: n.id, order: n.order }))}
          reorderApi="/api/notes/reorder"
        >
          {notes.map((note) => (
            <div key={note.id} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-foreground truncate">
                    {note.title}
                  </h3>
                  {note.published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <Eye className="w-3 h-3" />
                      已发布
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 flex-shrink-0">
                      <EyeOff className="w-3 h-3" />
                      草稿
                    </span>
                  )}
                  {(() => {
                    const noteTags = parseTags(note.tags);
                    return noteTags.length > 0 ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {noteTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-[rgba(168,230,225,0.12)] px-2 py-0.5 text-[11px] font-medium text-foreground/70">
                            {tag}
                          </span>
                        ))}
                        {noteTags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground/50">+{noteTags.length - 3}</span>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  /{note.slug}
                </p>
                <p className="text-[11px] text-muted-foreground/50 mt-2">
                  {new Date(note.createdAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/notes/${note.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-miku-primary-dark hover:bg-miku-primary/10 transition-colors"
                >
                  编辑
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <DeleteButton apiPath={`/api/notes/${note.id}`} itemName="笔记" />
              </div>
            </div>
          ))}
        </DragSortList>
      )}
    </div>
  );
}
