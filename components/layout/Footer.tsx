"use client";

import Link from "next/link";
import { Heart, Rss, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-7xl px-4 pb-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl backdrop-blur-xl px-6 py-8",
          "bg-[rgba(255,255,255,0.5)] border border-[rgba(168,230,225,0.2)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        {/* Line 1: ICP */}
        <a
          href="https://icp.gov.moe/?keyword=2026xxxx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground transition-colors hover:text-miku-primary"
        >
          萌ICP备 2026XXXX号
        </a>

        {/* Line 2: Copyright */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>&copy; {year} Miku Space. Crafted with</span>
          <Heart className="h-3.5 w-3.5 text-miku-pink fill-miku-pink" />
        </p>

        {/* Line 3: Utility links */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link
            href="/rss.xml"
            className="flex items-center gap-1 transition-colors hover:text-miku-primary"
          >
            <Rss className="h-3 w-3" />
            <span>RSS</span>
          </Link>
          <span className="text-[rgba(168,230,225,0.3)]">|</span>
          <Link
            href="/sitemap.xml"
            className="flex items-center gap-1 transition-colors hover:text-miku-primary"
          >
            <FileText className="h-3 w-3" />
            <span>Sitemap</span>
          </Link>
          <span className="text-[rgba(168,230,225,0.3)]">|</span>
          <span className="flex items-center gap-1">
            <span>Powered by</span>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-miku-primary"
            >
              Next.js
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
