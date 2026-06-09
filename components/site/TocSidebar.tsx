"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/utils";

interface TocSidebarProps {
  headings: TocItem[];
}

export default function TocSidebar({ headings }: TocSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const isClicking = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip observer updates right after a click to prevent jank
        if (isClicking.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);
    isClicking.current = true;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Re-enable observer after scroll animation completes
    setTimeout(() => {
      isClicking.current = false;
    }, 800);
  }

  if (headings.length === 0) return null;

  return (
    <nav
      className={cn(
        "sticky top-24",
        "rounded-2xl p-5",
        "bg-light-card backdrop-blur-xl border border-light-border",
        "dark:bg-dark-card dark:border-dark-border",
      )}
    >
      {/* Title with accent bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-0.75 h-4 rounded-full bg-miku-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-wide">
          目录
        </h3>
      </div>

      {/* Scrollable list */}
      <ul className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1 toc-scroll">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "relative block text-[13px] leading-snug py-1.5 px-2.5 rounded-md transition-colors duration-150 truncate",
                  heading.level === 2 && "pl-6",
                  heading.level === 3 && "pl-10",
                  isActive
                    ? "bg-miku-primary/8 text-miku-primary font-medium"
                    : "text-muted-foreground/50 hover:text-foreground/80 hover:bg-muted/30",
                )}
                title={heading.text}
              >
                {/* Active indicator bar — always rendered, opacity transitions smoothly */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-full bg-miku-primary transition-opacity duration-150",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .toc-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .toc-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .toc-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .toc-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
}
