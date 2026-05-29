"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-7xl px-4 pb-6">
      <div
        className={cn(
          "rounded-2xl backdrop-blur-xl px-6 py-5",
          "bg-[rgba(255,255,255,0.5)] border border-[rgba(168,230,225,0.2)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-miku-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>&copy; {year} Miku Space.</span>
            <span className="hidden sm:inline">Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-miku-pink fill-miku-pink" />
          </p>
        </div>
      </div>
    </footer>
  );
}
