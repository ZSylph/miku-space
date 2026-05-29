"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  createdAt: Date;
  type: "post" | "note";
}

interface LatestContentProps {
  items: ContentItem[];
}

const typeConfig = {
  post: {
    label: "文章",
    bgClass: "bg-[rgba(168,230,225,0.15)]",
    textClass: "text-miku-primary-dark",
  },
  note: {
    label: "笔记",
    bgClass: "bg-[rgba(245,198,208,0.15)]",
    textClass: "text-miku-pink",
  },
};

function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function LatestContent({ items }: LatestContentProps) {
  const displayItems = items.slice(0, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-[24px] p-6",
        "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">最新内容</h2>
        <Link
          href="/posts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          更多
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayItems.map((item, index) => {
          const config = typeConfig[item.type];
          const href = item.type === "post" ? `/posts/${item.slug}` : `/notes/${item.slug}`;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Link
                href={href}
                className={cn(
                  "block rounded-[16px] p-[14px]",
                  "bg-[rgba(168,230,225,0.04)]",
                  "hover:bg-[rgba(168,230,225,0.08)]",
                  "transition-colors duration-200"
                )}
              >
                {/* Type tag */}
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mb-2",
                    config.bgClass,
                    config.textClass
                  )}
                >
                  {config.label}
                </span>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1.5">
                  {item.title}
                </h3>

                {/* Date */}
                <time className="text-[11px] text-muted-foreground">
                  {formatDate(item.createdAt)}
                </time>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
