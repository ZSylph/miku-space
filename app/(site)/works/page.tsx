import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">作品展示</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <Link key={work.id} href={`/works/${work.slug}`}>
            <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center text-4xl">
                🚀
              </div>
              <h2 className="font-semibold text-lg">{work.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
