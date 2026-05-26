import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";

export default async function HomePage() {
  const [interests, works] = await Promise.all([
    prisma.interest.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.work.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
  ]);

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
      <WorksPreview works={works} />
    </div>
  );
}
