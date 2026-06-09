"use client";

import { Heart, Rss, FileText } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 pb-8 pt-4">
      {/* Dashed divider with center dot */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-full border-t border-dashed border-[rgba(168,230,225,0.8)] dark:border-[rgba(168,230,225,0.45)]" />
        <div className="absolute flex items-center justify-center w-5 h-5 bg-white/90 dark:bg-dark-base/90 rounded-full">
          <div className="w-2 h-2 rounded-full bg-miku-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-2.5 text-sm">
        <a
          href={`https://icp.gov.moe/?keyword=${siteConfig.icpNumber.replace(/[^\dA-Za-z]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/60 transition-colors hover:text-miku-primary-dark"
        >
          {siteConfig.icpNumber}
        </a>

        <p className="flex items-center gap-1.5 text-foreground/80">
          <span className="font-medium text-foreground">
            &copy; {year} Miku Space
          </span>
          <span className="text-[rgba(168,230,225,0.4)]">·</span>
          <span>All Rights Reserved</span>
        </p>

        <div className="flex items-center gap-3 text-foreground/70">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-miku-primary-dark transition-colors hover:text-miku-primary"
          >
            <Rss className="h-3.5 w-3.5" />
            <span className="font-medium">RSS</span>
          </a>
          <span className="text-[rgba(168,230,225,0.4)]">/</span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-miku-primary-dark transition-colors hover:text-miku-primary"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="font-medium">Sitemap</span>
          </a>
        </div>

        <p className="flex items-center gap-1.5 text-muted-foreground">
          <span>Crafted with</span>
          <Heart className="h-3.5 w-3.5 text-miku-pink fill-miku-pink" />
          <span>· Powered by</span>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground transition-colors hover:text-miku-primary"
          >
            Next.js
          </a>
        </p>
      </div>
    </footer>
  );
}
