import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">技术文章</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <div className="rounded-lg border p-6 hover:bg-accent transition-colors">
              <h2 className="font-semibold text-lg">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
