"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, StickyNote, Briefcase, Sparkles } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "仪表板", icon: LayoutDashboard },
  { href: "/admin/posts", label: "文章", icon: FileText },
  { href: "/admin/notes", label: "笔记", icon: StickyNote },
  { href: "/admin/works", label: "作品", icon: Briefcase },
  { href: "/admin/interests", label: "兴趣", icon: Sparkles },
];

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b",
        "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link href="/admin" className="font-bold text-foreground flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-miku-primary/20">
            <LayoutDashboard className="w-4 h-4 text-miku-primary-dark" />
          </span>
          管理后台
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-miku-primary/15 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.08)]"
                )}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
          <div className="w-px h-4 bg-border mx-1" />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  );
}
