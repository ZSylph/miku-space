import { prisma } from "@/lib/prisma";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">技术文章</h1>
        <p className="text-sm text-muted-foreground mt-1">
          关于前端开发、设计与技术的思考
        </p>
      </div>

      <div className="flex flex-col gap-4">
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
  );
}
