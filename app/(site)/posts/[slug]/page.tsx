import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    }),
  ]);

  return (
    <ContentDetail
      title={post.title}
      content={post.content}
      coverUrl={post.coverUrl}
      excerpt={post.excerpt || undefined}
      backHref="/posts"
      backLabel="返回文章列表"
      meta={
        <span className="text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("zh-CN")}
        </span>
      }
      prev={prevPost ? { title: prevPost.title, href: `/posts/${prevPost.slug}` } : null}
      next={nextPost ? { title: nextPost.title, href: `/posts/${nextPost.slug}` } : null}
    />
  );
}
