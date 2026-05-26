import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回文章列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {new Date(post.createdAt).toLocaleDateString("zh-CN")}
      </p>
      {post.excerpt && (
        <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary pl-4">
          {post.excerpt}
        </p>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
