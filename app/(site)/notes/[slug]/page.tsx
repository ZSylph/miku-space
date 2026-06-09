import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";
import { extractHeadings, countWords, parseTags, readingTime } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const getNote = cache((slug: string) =>
  prisma.note.findUnique({ where: { slug } })
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note || !note.published) return { title: "Not Found" };

  const url = `${siteConfig.url}/notes/${slug}`;
  const excerpt = note.content.slice(0, 160);
  return {
    title: note.title,
    description: excerpt,
    openGraph: {
      title: note.title,
      description: excerpt,
      url,
      type: "article",
      images: note.coverUrl ? [{ url: note.coverUrl }] : [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: excerpt,
      images: note.coverUrl ? [note.coverUrl] : [siteConfig.ogImage],
    },
    alternates: { canonical: url },
  };
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note || !note.published) {
    notFound();
  }

  const [prevNote, nextNote] = await Promise.all([
    prisma.note.findFirst({
      where: { published: true, order: { lt: note.order } },
      orderBy: { order: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.note.findFirst({
      where: { published: true, order: { gt: note.order } },
      orderBy: { order: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  const noteTags = parseTags(note.tags);
  const headings = extractHeadings(note.content);
  const wordCount = countWords(note.content);
  const readMinutes = readingTime(wordCount);

  return (
    <ContentDetail
      title={note.title}
      content={note.content}
      coverUrl={note.coverUrl}
      backHref="/notes"
      backLabel="返回笔记列表"
      meta={
        <>
          {noteTags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {noteTags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(168,230,225,0.12)] text-miku-primary-dark">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span className="text-sm text-muted-foreground/60">
            {readMinutes} min read
          </span>
        </>
      }
      prev={prevNote ? { title: prevNote.title, href: `/notes/${prevNote.slug}` } : null}
      next={nextNote ? { title: nextNote.title, href: `/notes/${nextNote.slug}` } : null}
      wordCount={wordCount}
      headings={headings}
      shareUrl={`${siteConfig.url}/notes/${slug}`}
      shareTitle={note.title}
    />
  );
}
