import { prisma } from "@/lib/prisma";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">作品展示</h1>
        <p className="text-sm text-muted-foreground mt-1">
          精选项目与实验性作品
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {works.map((work) => (
          <ContentCard
            key={work.id}
            item={work}
            href={`/works/${work.slug}`}
            variant="grid"
            aspectVideo
          />
        ))}
      </div>
    </div>
  );
}
