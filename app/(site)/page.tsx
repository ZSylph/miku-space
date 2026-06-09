import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/pages/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [interests, works, posts, notes, featuredPosts, postCount, noteCount, workCount, songs] =
    await Promise.all([
      prisma.interest.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      prisma.work.findMany({
        where: { featured: true },
        orderBy: { order: "asc" },
        take: 4,
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.note.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.post.findMany({
        where: { published: true, featured: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.note.count({ where: { published: true } }),
      prisma.work.count({ where: { featured: true } }),
      prisma.song.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    ]);

  return (
    <HomePageClient
      interests={interests}
      works={works}
      posts={posts}
      notes={notes}
      featuredPosts={featuredPosts}
      postCount={postCount}
      noteCount={noteCount}
      workCount={workCount}
      songs={songs}
    />
  );
}
