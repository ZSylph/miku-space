import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";
import WorksListingClient from "@/components/pages/WorksListingClient";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const [rawWorks, stats] = await Promise.all([
    prisma.work.findMany({
      orderBy: { order: "asc" },
    }),
    getSiteStats(),
  ]);

  const works = rawWorks.map((w) => ({
    ...w,
    techStack: (() => { try { return JSON.parse(w.techStack) as string[]; } catch { return []; } })(),
  }));

  const allTechNames = [...new Set(works.flatMap((w) => w.techStack))];
  const tags = allTechNames.map((name) => ({ id: name, name, slug: name }));

  return (
    <WorksListingClient
      works={works}
      tags={tags}
      stats={stats}
    />
  );
}
