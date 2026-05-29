"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-5 z-50 mx-auto max-w-7xl px-4 sm:px-6">
      <nav
        className={cn(
          "flex h-[60px] items-center justify-between rounded-2xl backdrop-blur-2xl px-6 shadow-[0_4px_24px_rgba(168,230,225,0.08)] transition-all duration-300",
          "bg-[rgba(255,255,255,0.65)] border border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_10px_rgba(168,230,225,0.35)]">
            <Music className="h-[18px] w-[18px] text-[#0D0D1A]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-foreground whitespace-nowrap">
            玖驻的Miku Space
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 mx-4">
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
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-miku-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Expandable Search */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 h-10 transition-all duration-300",
                  "bg-[rgba(168,230,225,0.12)] border border-[rgba(168,230,225,0.25)]",
                  "dark:bg-[rgba(255,255,255,0.06)] dark:border-[rgba(255,255,255,0.1)]"
                )}
              >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={2} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-32 lg:w-48"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
                aria-label="搜索"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
            aria-label="切换主题"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground"
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
