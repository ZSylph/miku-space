"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lastScrollY = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const handleEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovered(true);
  };

  const handleLeave = () => {
    hoverTimer.current = setTimeout(() => setHovered(false), 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      {/* Hover hit area — triggers header reveal when cursor approaches top edge */}
      {hidden && (
        <div
          className="fixed top-0 left-0 right-0 h-6 z-49"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        />
      )}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
          hidden && !hovered ? "-translate-y-full" : "translate-y-0",
        )}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-light-card-hover border-b border-[rgba(168,230,225,0.2)] dark:bg-[rgba(13,13,26,0.85)] dark:border-dark-border transition-[background-color,border-color] duration-300" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <nav className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <span className="font-(family-name:--font-xiaowei) text-[22px] tracking-tight text-foreground whitespace-nowrap">
                玖驻 <span className="text-miku-primary">の</span> Miku Space
              </span>
            </Link>

            {/* Desktop Nav + Actions */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-miku-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-miku-primary" />
                  )}
                </Link>
              ))}

              <div className="w-px h-5 bg-light-border dark:bg-[rgba(255,255,255,0.1)]" />

              {/* Search */}
              <div className="relative flex items-center overflow-hidden">
                <form
                  onSubmit={handleSearchSubmit}
                  className={cn(
                    "flex items-center gap-2 rounded-lg h-9 transition-all duration-300 ease-out overflow-hidden",
                    searchOpen
                      ? "px-2.5 w-40 lg:w-52 opacity-100"
                      : "px-0 w-0 opacity-0",
                    "bg-[rgba(168,230,225,0.12)] border border-[rgba(168,230,225,0.2)]",
                    "dark:bg-dark-card-hover dark:border-[rgba(255,255,255,0.1)]",
                  )}
                >
                  <Search
                    className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                    strokeWidth={2}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </form>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 shrink-0",
                    searchOpen
                      ? "opacity-0 w-0 pointer-events-none"
                      : "opacity-100 w-9",
                    "text-muted-foreground hover:text-miku-primary",
                  )}
                  aria-label="搜索"
                >
                  <Search className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-miku-primary"
                aria-label="切换主题"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="菜单"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden relative">
            <div
              className={cn(
                "mx-6 rounded-2xl backdrop-blur-2xl p-3 shadow-[0_4px_24px_rgba(168,230,225,0.12)]",
                "bg-[rgba(255,255,255,0.9)] border border-[rgba(168,230,225,0.2)]",
                "dark:bg-[rgba(13,13,26,0.9)] dark:border-dark-border",
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
                      : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.05)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
