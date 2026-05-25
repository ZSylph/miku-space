import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";

export default async function HomePage() {
  const interests = await prisma.interest.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
    </div>
  );
}
