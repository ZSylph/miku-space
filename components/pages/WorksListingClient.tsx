"use client";

import ContentShell from "@/components/layout/ContentShell";
import WorkCard from "@/components/site/WorkCard";

interface WorkItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
  repoUrl?: string | null;
  techStack: string[];
}

interface WorksListingClientProps {
  works: WorkItem[];
  tags: { id: string; name: string; slug: string }[];
  stats: { posts: number; notes: number; works: number };
}

export default function WorksListingClient({ works, tags, stats }: WorksListingClientProps) {
  return (
    <ContentShell section="works" tags={tags} stats={stats}>
      {(selectedTag) => {
        const filtered = selectedTag
          ? works.filter((w) => w.techStack.includes(selectedTag))
          : works;

        return (
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-12 h-px bg-muted-foreground/15 mb-5" />
                <p className="text-sm text-muted-foreground/50 tracking-widest">
                  {selectedTag ? "该技术栈下暂无作品" : "暂无作品"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((work) => (
                  <WorkCard
                    key={work.id}
                    title={work.title}
                    description={work.description}
                    coverUrl={work.coverUrl}
                    repoUrl={work.repoUrl}
                    techStack={work.techStack}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    </ContentShell>
  );
}
