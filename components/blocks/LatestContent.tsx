"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  type: "post" | "note";
}

interface LatestContentProps {
  items: TimelineItem[];
}

const typeConfig = {
  post: {
    label: "文章",
    color: "text-miku-primary-dark dark:text-miku-primary",
    bg: "bg-miku-primary/20 dark:bg-miku-primary/10",
  },
  note: {
    label: "笔记",
    color: "text-miku-pink dark:text-miku-pink",
    bg: "bg-miku-pink/20 dark:bg-miku-pink/10",
  },
};

function formatMonthDay(date: Date): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function groupByYear(items: TimelineItem[]) {
  const groups: Record<number, TimelineItem[]> = {};
  for (const item of items) {
    const year = new Date(item.createdAt).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearItems]) => ({
      year: Number(year),
      items: yearItems.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }));
}

export default function LatestContent({ items }: LatestContentProps) {
  const displayItems = items.slice(0, 8);
  const grouped = groupByYear(displayItems);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-[24px] p-7 h-full flex flex-col",
        "bg-light-card backdrop-blur-xl border border-light-border",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "dark:bg-dark-card dark:border-dark-border",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">最新内容</h2>
        <Link
          href="/posts"
          className="text-sm font-medium text-muted-foreground hover:text-miku-primary transition-colors"
        >
          更多 →
        </Link>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
        <div className="flex flex-col">
          {grouped.map((group) => (
            <div key={group.year} className="mb-5 last:mb-0">
              <div className="grid grid-cols-[64px_16px_1fr] gap-x-4 relative">
                {/* Dashed axis line — centered on 2nd grid column (64 + 16 gap + 7.5 half-col - 0.5 line) */}
                <div
                  className="absolute w-px border-l border-dashed border-light-border dark:border-dark-border pointer-events-none"
                  style={{
                    left: "calc(64px + 16px + 7.5px)",
                    top: "28px",
                    bottom: "12px",
                  }}
                />

                {/* Year header row */}
                <div className="text-right text-[32px] font-bold text-foreground leading-none self-center pb-3">
                  {group.year}
                </div>
                <div className="flex justify-center self-center pb-3 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-miku-primary bg-white dark:bg-dark-base" />
                </div>
                <div className="self-center pb-3 text-sm text-muted-foreground font-medium">
                  {group.items.length} 篇{typeConfig[group.items[0].type].label}
                </div>

                {/* Items */}
                {group.items.map((item) => {
                  const config = typeConfig[item.type];
                  const href =
                    item.type === "post"
                      ? `/posts/${item.slug}`
                      : `/notes/${item.slug}`;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                      className="contents"
                    >
                      {/* Date */}
                      <div className="text-right text-base text-muted-foreground font-medium self-center leading-none py-2.5">
                        {formatMonthDay(item.createdAt)}
                      </div>

                      {/* Dot — outer opaque ring covers dashed line, inner solid color */}
                      <div className="flex justify-center self-center py-2.5 relative z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-dark-base flex items-center justify-center">
                          <div className="w-1.25 h-1.25 rounded-full bg-miku-primary dark:bg-miku-primary-dark" />
                        </div>
                      </div>

                      {/* Title + tag */}
                      <div className="self-center py-2.5 min-w-0">
                        <Link
                          href={href}
                          className="group flex items-center justify-between gap-3"
                        >
                          <span className="text-base font-semibold text-foreground group-hover:text-miku-primary transition-colors truncate">
                            {item.title}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full shrink-0 font-medium leading-none",
                              config.bg,
                              config.color,
                            )}
                          >
                            {config.label}
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
