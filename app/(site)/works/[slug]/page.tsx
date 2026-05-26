import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });

  if (!work) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/works" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回作品列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{work.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{work.description}</p>

      {(work.demoUrl || work.repoUrl) && (
        <div className="flex gap-4 mb-8">
          {work.demoUrl && (
            <a
              href={work.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              查看演示
            </a>
          )}
          {work.repoUrl && (
            <a
              href={work.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              源代码
            </a>
          )}
        </div>
      )}

      {work.content && (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{work.content}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}
