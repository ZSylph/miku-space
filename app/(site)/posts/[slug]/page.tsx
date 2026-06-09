import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";
import { extractHeadings, countWords, parseTags, readingTime, stripMarkdown, truncateText } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const getPost = cache((slug: string) =>
  prisma.post.findUnique({ where: { slug } })
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) return { title: "Not Found" };

  const url = `${siteConfig.url}/posts/${slug}`;
  return {
    title: post.title,
    description: truncateText(stripMarkdown(post.content), 160),
    openGraph: {
      title: post.title,
      description: truncateText(stripMarkdown(post.content), 160),
      url,
      type: "article",
      images: post.coverUrl ? [{ url: post.coverUrl }] : [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: truncateText(stripMarkdown(post.content), 160),
      images: post.coverUrl ? [post.coverUrl] : [siteConfig.ogImage],
    },
    alternates: { canonical: url },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, order: { lt: post.order } },
      orderBy: { order: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: { published: true, order: { gt: post.order } },
      orderBy: { order: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  const postTags = parseTags(post.tags);
  const headings = extractHeadings(post.content);
  const wordCount = countWords(post.content);
  const readMinutes = readingTime(wordCount);

  return (
    <ContentDetail
      title={post.title}
      content={post.content}
      coverUrl={post.coverUrl}
      backHref="/posts"
      backLabel="返回文章列表"
      meta={
        <>
          {postTags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {postTags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(168,230,225,0.12)] text-miku-primary-dark">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span className="text-sm text-muted-foreground/60">
            {readMinutes} min read
          </span>
        </>
      }
      prev={prevPost ? { title: prevPost.title, href: `/posts/${prevPost.slug}` } : null}
      next={nextPost ? { title: nextPost.title, href: `/posts/${nextPost.slug}` } : null}
      wordCount={wordCount}
      headings={headings}
      shareUrl={`${siteConfig.url}/posts/${slug}`}
      shareTitle={post.title}
    />
  );
}
