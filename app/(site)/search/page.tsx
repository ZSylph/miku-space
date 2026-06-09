import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import { parseTags } from "@/lib/utils";
import SearchPageClient from "@/components/pages/SearchPageClient";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let rawPosts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  let rawNotes: Awaited<ReturnType<typeof prisma.note.findMany>> = [];
  let rawWorks: Awaited<ReturnType<typeof prisma.work.findMany>> = [];

  if (query) {
    [rawPosts, rawNotes, rawWorks] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.note.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.work.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        orderBy: { order: "asc" },
        take: 10,
      }),
    ]);
  }

  const stats = await getSiteStats();

  // Parse tags from posts and notes
  const posts = rawPosts.map((p) => ({
    ...p,
    tags: parseTags(p.tags),
  }));

  const notes = rawNotes.map((n) => ({
    ...n,
    tags: parseTags(n.tags),
  }));

  // Parse techStack from works
  const works = rawWorks.map((w) => ({
    ...w,
    techStack: (() => {
      try {
        return JSON.parse(w.techStack) as string[];
      } catch {
        return [];
      }
    })(),
  }));

  // Build unique tag list from posts and notes for the sidebar
  const allTagNames = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      allTagNames.add(tag);
    }
  }
  for (const note of notes) {
    for (const tag of note.tags) {
      allTagNames.add(tag);
    }
  }
  const allTags = [...allTagNames].map((name) => ({
    id: name,
    name,
    slug: name,
  }));

  return (
    <SearchPageClient
      posts={posts}
      notes={notes}
      works={works}
      query={query}
      stats={stats}
      allTags={allTags}
    />
  );
}
