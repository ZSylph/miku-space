import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import AdminListHeader from "@/components/admin/AdminListHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import DeleteButton from "@/components/admin/DeleteButton";
import DragSortList from "@/components/admin/DragSortList";
import {
  FileText,
  ArrowUpRight,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { order: "asc" },
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;
  const allTags = posts.flatMap((p) => parseTags(p.tags));
  const uniqueTags = [...new Set(allTags)];

  return (
    <div className="space-y-5">
      <AdminListHeader
        icon={<FileText className="w-5 h-5 text-blue-500" />}
        iconClassName="bg-blue-500/10 dark:bg-blue-500/15"
        title="文章管理"
        subtitle={`共 ${posts.length} 篇 · ${publishedCount} 已发布 · ${draftCount} 草稿${uniqueTags.length > 0 ? ` · ${uniqueTags.length} 个标签` : ""} · 拖拽排序`}
        actionHref="/admin/posts/new"
        actionLabel="新建文章"
      />

      {posts.length === 0 ? (
        <AdminEmptyState
          icon={<FileText className="w-10 h-10" />}
          message="还没有文章，点击上方按钮创建第一篇"
          actionHref="/admin/posts/new"
          actionLabel="创建文章"
        />
      ) : (
        <DragSortList
          items={posts.map((p) => ({ id: p.id, order: p.order }))}
          reorderApi="/api/posts/reorder"
        >
          {posts.map((post) => (
            <div key={post.id} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-foreground truncate">
                    {post.title}
                  </h3>
                  {post.published ? (
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
                  {post.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400 flex-shrink-0">
                      <Star className="w-3 h-3" />
                      精选
                    </span>
                  )}
                  {(() => {
                    const postTags = parseTags(post.tags);
                    return postTags.length > 0 ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {postTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-[rgba(168,230,225,0.12)] px-2 py-0.5 text-[11px] font-medium text-foreground/70">
                            {tag}
                          </span>
                        ))}
                        {postTags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground/50">+{postTags.length - 3}</span>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  /{post.slug}
                </p>
                <p className="text-[11px] text-muted-foreground/50 mt-2">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-miku-primary-dark hover:bg-miku-primary/10 transition-colors"
                >
                  编辑
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <DeleteButton apiPath={`/api/posts/${post.id}`} itemName="文章" />
              </div>
            </div>
          ))}
        </DragSortList>
      )}
    </div>
  );
}
