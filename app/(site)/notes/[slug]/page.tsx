import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });

  if (!note || !note.published) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回笔记列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{note.title}</h1>
      <div className="flex items-center gap-2 mb-8">
        {note.category && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
            {note.category}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString("zh-CN")}
        </span>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>
    </article>
  );
}
