import { prisma } from "@/lib/prisma";
import PetalParticles from "@/components/effects/PetalParticles";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import HeroSection from "@/components/blocks/HeroSection";
import LyricBar from "@/components/blocks/LyricBar";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";
import ContentFeed from "@/components/blocks/ContentFeed";

export default async function HomePage() {
  const [interests, works, posts, notes, postCount, noteCount, workCount] =
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
      prisma.post.count({ where: { published: true } }),
      prisma.note.count({ where: { published: true } }),
      prisma.work.count({ where: { featured: true } }),
    ]);

  const contentItems = [
    ...posts.map((p) => ({ ...p, type: "post" as const })),
    ...notes.map((n) => ({ ...n, type: "note" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <PetalParticles />
      <FloatingOrbs />
      <div className="relative z-10">
        <HeroSection
          stats={{ posts: postCount, notes: noteCount, works: workCount }}
        />
        <LyricBar />
        <InterestGrid interests={interests} />
        <WorksPreview works={works} />
        <ContentFeed items={contentItems} />
      </div>
    </>
  );
}
