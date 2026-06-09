"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface ContentShellProps {
  section: "posts" | "notes" | "works" | "search";
  tags: TagItem[];
  stats: { posts: number; notes: number; works: number };
  children: (selectedTag: string | null) => React.ReactNode;
}

const sectionConfig = {
  posts: { title: "文章", desc: "关于前端开发、设计与技术的思考" },
  notes: { title: "笔记", desc: "零散的知识记录与备忘" },
  works: { title: "作品", desc: "精选项目与实验性作品" },
  search: { title: "搜索", desc: "搜索文章、笔记和作品" },
};

const glassPanel = cn(
  "rounded-2xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
  "transition-[background-color,border-color] duration-300",
);

export default function ContentShell({
  section,
  tags,
  stats,
  children,
}: ContentShellProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { title, desc } = sectionConfig[section];

  return (
    <div className="flex gap-5">
      {/* Left sidebar — sticky */}
      <div className="hidden lg:block sticky top-20 self-start">
        <Sidebar
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          stats={stats}
        />
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* ── Dashboard bar ── */}
        <div className={cn(glassPanel, "relative overflow-hidden px-5 py-4")}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left — Title & description */}
            <div className="flex items-center gap-3">
              {/* Pulsing status dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-miku-primary/30 animate-ping" />
                <span className="relative rounded-full h-2.5 w-2.5 bg-miku-primary" />
              </span>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {title}
                  <span className="text-muted-foreground/30 font-normal text-[13px] ml-2">
                    / {section.toUpperCase()}
                  </span>
                </h2>
                <p className="text-[11px] text-muted-foreground/50 mt-0.5 tracking-wide">
                  {desc}
                </p>
              </div>
            </div>

            {/* Right — Metrics */}
            <div className="flex items-center gap-5">
              {section !== "search" && (
                <Metric label="篇数" value={String(stats[section]).padStart(2, "0")} />
              )}
              {tags.length > 0 && (
                <>
                  {section !== "search" && <MetricDot />}
                  <Metric label="标签" value={String(tags.length).padStart(2, "0")} />
                </>
              )}
              {selectedTag && (
                <>
                  <MetricDot />
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-[11px] text-miku-primary hover:underline underline-offset-2"
                  >
                    清除筛选
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-miku-primary/40 via-miku-primary/10 to-transparent" />
        </div>

        {/* ── Content container ── */}
        <div
          className={cn(
            glassPanel,
            "flex-1 p-5 md:p-6",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={section + "-" + (selectedTag || "all")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children(selectedTag)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Small metric display ── */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <span className="block text-sm font-bold text-foreground tabular-nums leading-tight">
        {value}
      </span>
      <span className="block text-[10px] text-muted-foreground/40 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}

/* ── Separator dot between metrics ── */
function MetricDot() {
  return (
    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" aria-hidden="true" />
  );
}
