import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { stripMarkdown, truncateText } from "@/lib/utils";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: Date): string {
  return date.toUTCString();
}

interface FeedItem {
  title: string;
  slug: string;
  path: string;        // e.g. "/posts" or "/notes" or "/works"
  description: string;
  updatedAt: Date;
  tags?: string[];
}

export async function GET() {
  const baseUrl = siteConfig.url;

  const [posts, notes, works] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.note.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.work.findMany({
      orderBy: { order: "asc" },
      take: 20,
    }),
  ]);

  const items: FeedItem[] = [
    ...posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      path: "/posts",
      description: truncateText(stripMarkdown(p.content), 300),
      updatedAt: p.updatedAt,
    })),
    ...notes.map((n) => ({
      title: n.title,
      slug: n.slug,
      path: "/notes",
      description: truncateText(stripMarkdown(n.content), 300),
      updatedAt: n.updatedAt,
      tags: (() => { try { return JSON.parse(n.tags) as string[]; } catch { return []; } })(),
    })),
    ...works.map((w) => ({
      title: w.title,
      slug: w.slug,
      path: "/works",
      description: w.description,
      updatedAt: w.updatedAt,
    })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const latestUpdate = items.length > 0 ? items[0].updatedAt : new Date();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${toRfc822(latestUpdate)}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(`${baseUrl}${item.path}/${item.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${baseUrl}${item.path}/${item.slug}`)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRfc822(item.updatedAt)}</pubDate>${
        item.tags && item.tags.length > 0
          ? item.tags.map((t) => `\n      <category>${escapeXml(t)}</category>`).join("")
          : ""
      }
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
