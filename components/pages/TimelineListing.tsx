"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ContentShell from "@/components/layout/ContentShell";

export interface TimelineItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  parsedTags: string[];
  createdAt: Date;
}

interface YearGroup {
  year: number;
  items: TimelineItem[];
}

function groupByYear(items: TimelineItem[]): YearGroup[] {
  const map = new Map<number, TimelineItem[]>();
  for (const item of items) {
    const year = new Date(item.createdAt).getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(item);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, yearItems]) => ({ year, items: yearItems }));
}

function formatMonthDay(date: Date): string {
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ── Layout constants (all px) ── */
const DOT_COL = 40;
const YEAR_DOT = 12;
const DOT = 8;
const DOT_GAP = 16;

interface TimelineListingProps {
  items: TimelineItem[];
  tags: { id: string; name: string; slug: string }[];
  stats: { posts: number; notes: number; works: number };
  section: "posts" | "notes";
  hrefPrefix: string;
  emptyLabel: string;
  unitLabel: string;
}

export default function TimelineListing({
  items,
  tags,
  stats,
  section,
  hrefPrefix,
  emptyLabel,
  unitLabel,
}: TimelineListingProps) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  return (
    <ContentShell section={section} tags={tags} stats={stats}>
      {(selectedTag) => {
        const filtered = selectedTag
          ? items.filter((n) => n.parsedTags.includes(selectedTag))
          : items;

        const yearGroups = groupByYear(filtered);

        if (filtered.length === 0) {
          return (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-px bg-muted-foreground/15 mb-5" />
              <p className="text-sm text-muted-foreground/50 tracking-widest">
                {selectedTag
                  ? `该标签下暂无${emptyLabel}`
                  : `暂无${emptyLabel}`}
              </p>
            </div>
          );
        }

        return (
          <div>
            {yearGroups.map((group) => {
              const isExpanded = !selectedTag
                ? !expandedYears.has(group.year)
                : true;

              return (
                <div key={group.year} className="relative mb-3 last:mb-0">
                  {/* Year header */}
                  <button
                    onClick={() => !selectedTag && toggleYear(group.year)}
                    className={cn(
                      "relative flex items-center z-20 py-3",
                      selectedTag ? "cursor-default" : "cursor-pointer",
                    )}
                  >
                    <span
                      className="shrink-0 flex items-center justify-center relative"
                      style={{ width: DOT_COL }}
                    >
                      <span
                        className={cn(
                          "relative rounded-full transition-colors duration-300",
                          isExpanded
                            ? "bg-miku-primary"
                            : "bg-muted-foreground/25",
                        )}
                        style={{ width: YEAR_DOT, height: YEAR_DOT }}
                      />
                    </span>
                    <span style={{ width: DOT_GAP }} className="shrink-0" />
                    <span className="text-[22px] font-bold text-foreground select-none">
                      {group.year}
                    </span>
                    <span className="text-[13px] text-muted-foreground/50 select-none ml-3">
                      {group.items.length} {unitLabel}
                    </span>
                  </button>

                  {/* Entries + track line */}
                  {isExpanded && (
                    <div className="relative z-10">
                      <div
                        className="absolute z-0 border-l-2 border-dashed border-black/8 dark:border-white/8"
                        style={{
                          left: DOT_COL / 2 - 1,
                          top: -2,
                          bottom: 0,
                        }}
                      />
                      {group.items.map((item) => (
                        <TimelineEntry
                          key={item.id}
                          item={item}
                          hrefPrefix={hrefPrefix}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }}
    </ContentShell>
  );
}

function TimelineEntry({
  item,
  hrefPrefix,
}: {
  item: TimelineItem;
  hrefPrefix: string;
}) {
  return (
    <Link
      href={`${hrefPrefix}/${item.slug}`}
      className="group flex items-center py-2.5 transition-colors duration-200 hover:bg-miku-primary/5 rounded-lg -mx-2 px-2"
    >
      <span
        className="shrink-0 flex items-center justify-center relative"
        style={{ width: DOT_COL }}
      >
        <span
          className="absolute z-10 rounded-full bg-background"
          style={{
            width: DOT + 4,
            height: DOT + 4,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <span
          className={cn(
            "absolute z-20 rounded-full",
            "bg-muted-foreground/30 group-hover:bg-miku-primary",
            "transition-all duration-300 ease-out",
            "w-2 h-2",
            "group-hover:w-0.75 group-hover:h-7",
          )}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        />
      </span>

      <span style={{ width: DOT_GAP }} className="shrink-0" />

      <span className="text-sm text-muted-foreground/50 tabular-nums w-13.5 shrink-0 group-hover:text-foreground/70 transition-colors duration-200">
        {formatMonthDay(item.createdAt)}
      </span>

      <span className="flex-1 min-w-0 text-[15px] font-medium text-foreground/85 group-hover:text-miku-primary transition-colors duration-200 truncate">
        {item.title}
      </span>

      {item.parsedTags.length > 0 && (
        <div className="items-center gap-2 shrink-0 hidden sm:flex">
          {item.parsedTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground/40 group-hover:text-miku-primary/50 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
          {item.parsedTags.length > 3 && (
            <span className="text-xs text-muted-foreground/30">
              +{item.parsedTags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
