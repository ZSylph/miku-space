import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";
import ContentFeed from "@/components/blocks/ContentFeed";

export default async function HomePage() {
  const [interests, works, posts, notes] = await Promise.all([
    prisma.interest.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.work.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.note.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const contentItems = [
    ...posts.map((p) => ({ ...p, type: "post" as const })),
    ...notes.map((n) => ({ ...n, type: "note" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
      <WorksPreview works={works} />
      <ContentFeed items={contentItems} />
    </div>
  );
}
