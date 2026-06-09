"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import MiniPlayer from "@/components/music/MiniPlayer";

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface SidebarProps {
  tags: TagItem[];
  selectedTag: string | null;
  onTagSelect: (slug: string | null) => void;
  stats: { posts: number; notes: number; works: number };
}

const glassCard = cn(
  "rounded-2xl backdrop-blur-xl border transition-[background-color,border-color] duration-300",
  "bg-[rgba(255,255,255,0.75)] border-[rgba(168,230,225,0.2)]",
  "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
  "dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.08)]",
);

export default function Sidebar({
  tags,
  selectedTag,
  onTagSelect,
  stats,
}: SidebarProps) {
  const [expandedTags, setExpandedTags] = useState(false);
  const visibleTags = expandedTags ? tags : tags.slice(0, 8);
  const hasMore = tags.length > 8;

  const handleTagClick = useCallback(
    (slug: string) => {
      onTagSelect(selectedTag === slug ? null : slug);
    },
    [selectedTag, onTagSelect],
  );

  const statItems = [
    { value: stats.posts, label: "文章" },
    { value: stats.notes, label: "笔记" },
    { value: stats.works, label: "作品" },
  ];

  const socials = [
    {
      label: "GitHub",
      href: siteConfig.social.github,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "Bilibili",
      href: siteConfig.social.bilibili,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: `mailto:${siteConfig.social.email}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: "RSS",
      href: "/rss.xml",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-70 shrink-0 flex flex-col gap-3">
      {/* Personal card */}
      <div className={cn(glassCard, "p-5")}>
        {/* Avatar + Name — centered layout */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-17 h-17 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(168,230,225,0.3)] mb-3 ring-2 ring-miku-primary/20">
            <Image
              src="/zsxy.jpg"
              alt="头像"
              width={68}
              height={68}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <h2 className="text-lg font-bold bg-linear-to-r from-miku-primary to-miku-primary-light bg-clip-text text-transparent">
            玖驻zsxy
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            设计师 / 开发者 / 二次元
          </p>
        </div>

        {/* Signature */}
        <p className="text-[12px] text-muted-foreground text-center leading-relaxed mb-4">
          坐而言不如起而行，探索技术与设计的交汇处。
        </p>

        {/* Stats — larger display */}
        <div className="flex items-center justify-around py-3 rounded-xl bg-[rgba(168,230,225,0.06)] dark:bg-[rgba(255,255,255,0.03)] mb-4">
          {statItems.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-miku-primary leading-none">
                {s.value}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-2">
          {socials.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                "bg-[rgba(168,230,225,0.1)] text-muted-foreground",
                "hover:text-miku-primary hover:bg-light-border hover:scale-105",
              )}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Music player */}
      <div className={cn(glassCard, "p-4")}>
        <MiniPlayer />
      </div>

      {/* Tags */}
      <div className={cn(glassCard, "p-4")}>
        <h3 className="text-sm font-semibold mb-3">标签</h3>
        {tags.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.slug)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedTag === tag.slug
                      ? "bg-miku-primary text-dark-base"
                      : "bg-[rgba(168,230,225,0.1)] text-muted-foreground hover:bg-[rgba(168,230,225,0.2)] hover:text-foreground",
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            {hasMore && (
              <button
                onClick={() => setExpandedTags(!expandedTags)}
                className="mt-2 text-[11px] text-miku-primary-dark hover:text-miku-primary transition-colors"
              >
                {expandedTags ? "收起" : `... 更多`}
              </button>
            )}
            {selectedTag && (
              <button
                onClick={() => onTagSelect(null)}
                className="mt-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                清除筛选
              </button>
            )}
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground/50">暂无标签</p>
        )}
      </div>
    </aside>
  );
}
