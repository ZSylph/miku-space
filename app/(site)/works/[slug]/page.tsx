import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });
  if (!work) return { title: "Not Found" };
  return { title: work.title, description: work.description };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });

  if (!work) {
    notFound();
  }

  const [prevWork, nextWork] = await Promise.all([
    prisma.work.findFirst({
      where: { createdAt: { gt: work.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { title: true, slug: true },
    }),
    prisma.work.findFirst({
      where: { createdAt: { lt: work.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    }),
  ]);

  return (
    <ContentDetail
      title={work.title}
      content={work.content || ""}
      coverUrl={work.coverUrl}
      backHref="/works"
      backLabel="返回作品列表"
      extra={
        <>
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
        </>
      }
      prev={prevWork ? { title: prevWork.title, href: `/works/${prevWork.slug}` } : null}
      next={nextWork ? { title: nextWork.title, href: `/works/${nextWork.slug}` } : null}
    />
  );
}
