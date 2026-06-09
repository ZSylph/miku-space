import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { getSiteStats } from "@/lib/site-stats";
import TimelineListing from "@/components/pages/TimelineListing";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const [rawPosts, stats] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    getSiteStats(),
  ]);

  // Parse inline JSON tags
  const posts = rawPosts.map((p) => {
    const { tags: rawTags, ...rest } = p;
    const parsedTags = parseTags(rawTags);
    return { ...rest, parsedTags };
  });

  // Extract unique tags from all posts
  const allTagNames = [...new Set(posts.flatMap((p) => p.parsedTags))];
  const tagItems = allTagNames.map((name) => ({ id: name, name, slug: name }));

  return (
    <TimelineListing
      items={posts}
      tags={tagItems}
      stats={stats}
      section="posts"
      hrefPrefix="/posts"
      emptyLabel="文章"
      unitLabel="篇文章"
    />
  );
}
