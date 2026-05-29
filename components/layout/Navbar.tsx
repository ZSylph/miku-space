"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu, X, Music } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <nav
        className={cn(
          "flex h-[52px] items-center justify-between rounded-2xl backdrop-blur-2xl px-5 shadow-[0_4px_24px_rgba(168,230,225,0.08)] transition-all duration-300",
          "bg-[rgba(255,255,255,0.65)] border border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_8px_rgba(168,230,225,0.3)]">
            <Music className="h-4 w-4 text-[#0D0D1A]" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Miku Space
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === link.href
                  ? "text-miku-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.1)]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-miku-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
            aria-label="搜索"
          >
            <Search className="h-4 w-4" strokeWidth={2} />
          </Link>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
            aria-label="切换主题"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden mt-2 rounded-2xl backdrop-blur-2xl p-3 shadow-[0_4px_24px_rgba(168,230,225,0.12)]",
            "bg-[rgba(255,255,255,0.65)] border border-[rgba(168,230,225,0.25)]",
            "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-miku-primary bg-[rgba(168,230,225,0.1)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.05)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
