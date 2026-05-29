import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });
  if (!note || !note.published) return { title: "Not Found" };
  return { title: note.title };
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });

  if (!note || !note.published) {
    notFound();
  }

  const [prevNote, nextNote] = await Promise.all([
    prisma.note.findFirst({
      where: { published: true, createdAt: { gt: note.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.note.findFirst({
      where: { published: true, createdAt: { lt: note.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    }),
  ]);

  return (
    <ContentDetail
      title={note.title}
      content={note.content}
      coverUrl={note.coverUrl}
      backHref="/notes"
      backLabel="返回笔记列表"
      meta={
        <>
          {note.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
              {note.category}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString("zh-CN")}
          </span>
        </>
      }
      prev={prevNote ? { title: prevNote.title, href: `/notes/${prevNote.slug}` } : null}
      next={nextNote ? { title: nextNote.title, href: `/notes/${nextNote.slug}` } : null}
    />
  );
}
