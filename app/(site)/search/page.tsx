import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";
import { FileText, StickyNote, Briefcase, SearchX } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  let notes: Awaited<ReturnType<typeof prisma.note.findMany>> = [];
  let works: Awaited<ReturnType<typeof prisma.work.findMany>> = [];

  if (query) {
    [posts, notes, works] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
            { content: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.note.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.work.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { content: { contains: query } },
          ],
        },
        orderBy: { order: "asc" },
        take: 10,
      }),
    ]);
  }

  const total = posts.length + notes.length + works.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">搜索</h1>
        <p className="text-sm text-muted-foreground mt-1">
          搜索文章、笔记和作品
        </p>
      </div>

      {/* Search Input */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <SearchInput defaultValue={query} />
      </div>

      {/* Results */}
      {query && (
        <>
          <p className="text-sm text-muted-foreground px-1">
            「{query}」的搜索结果：共 {total} 条
          </p>

          {total === 0 && (
            <div
              className={cn(
                "rounded-3xl backdrop-blur-xl border p-12 text-center",
                "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
              )}
            >
              <SearchX className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                未找到相关结果，请尝试其他关键词
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <FileText className="w-4 h-4 text-miku-primary-dark" />
                <h2 className="text-sm font-semibold text-foreground">文章</h2>
                <span className="text-xs text-muted-foreground">({posts.length})</span>
              </div>
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <ContentCard
                    key={post.id}
                    item={post}
                    href={`/posts/${post.slug}`}
                    variant="list"
                    showExcerpt
                  />
                ))}
              </div>
            </div>
          )}

          {notes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <StickyNote className="w-4 h-4 text-miku-pink" />
                <h2 className="text-sm font-semibold text-foreground">笔记</h2>
                <span className="text-xs text-muted-foreground">({notes.length})</span>
              </div>
              <div className="flex flex-col gap-3">
                {notes.map((note) => (
                  <ContentCard
                    key={note.id}
                    item={note}
                    href={`/notes/${note.slug}`}
                    variant="list"
                    showCategory
                  />
                ))}
              </div>
            </div>
          )}

          {works.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Briefcase className="w-4 h-4 text-miku-primary-dark" />
                <h2 className="text-sm font-semibold text-foreground">作品</h2>
                <span className="text-xs text-muted-foreground">({works.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {works.map((work) => (
                  <ContentCard
                    key={work.id}
                    item={{
                      ...work,
                      excerpt: work.description,
                    }}
                    href={`/works/${work.slug}`}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!query && (
        <div
          className={cn(
            "rounded-3xl backdrop-blur-xl border p-12 text-center",
            "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
            "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
          )}
        >
          <p className="text-muted-foreground">
            输入关键词开始搜索文章、笔记和作品
          </p>
        </div>
      )}
    </div>
  );
}
