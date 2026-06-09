"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  StickyNote,
  Briefcase,
  Heart,
  Music,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  X,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [{ label: "仪表盘", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "内容管理",
    items: [
      { label: "文章", href: "/admin/posts", icon: FileText },
      { label: "笔记", href: "/admin/notes", icon: StickyNote },
      { label: "作品", href: "/admin/works", icon: Briefcase },
      { label: "兴趣", href: "/admin/interests", icon: Heart },
    ],
  },
  {
    title: "媒体",
    items: [{ label: "歌曲", href: "/admin/songs", icon: Music }],
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 border-b",
          "border-[rgba(168,230,225,0.15)] dark:border-dark-card-hover",
          isMobile
            ? "px-5 py-4"
            : collapsed
              ? "px-3 py-4 justify-center"
              : "px-5 py-4",
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-miku-primary to-miku-pink flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        {!(!isMobile && collapsed) && (
          <div className="min-w-0">
            <h2 className="font-bold text-foreground text-sm leading-tight">
              Miku Space
            </h2>
            <p className="text-[11px] text-muted-foreground truncate">
              管理控制台
            </p>
          </div>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-lg hover:bg-light-card transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-1">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-2" : ""}>
            {group.title && !(!isMobile && collapsed) && (
              <div
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1",
                  isMobile ? "px-5" : "px-5",
                )}
              >
                {group.title}
              </div>
            )}
            {group.title && !isMobile && collapsed && (
              <div className="flex justify-center mb-1">
                <div className="w-4 h-px bg-[rgba(168,230,225,0.15)] dark:bg-dark-card-hover" />
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href, pathname);
              const Icon = item.icon;
              const showLabel = isMobile || !collapsed;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileOpen(false)}
                  title={collapsed && !isMobile ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 mx-2 my-0.5 rounded-xl text-[13px] transition-all duration-200 group",
                    showLabel ? "px-3 py-2.5" : "px-2.5 py-2.5 justify-center",
                    active
                      ? "bg-miku-primary/15 text-miku-primary-dark dark:text-miku-primary font-semibold shadow-[inset_0_1px_0_rgba(168,230,225,0.15)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.08)] dark:hover:bg-dark-card",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 shrink-0",
                      active && "drop-shadow-[0_0_4px_rgba(168,230,225,0.4)]",
                    )}
                  />
                  {showLabel && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-[rgba(168,230,225,0.15)] dark:border-dark-card-hover",
          isMobile ? "p-4" : collapsed ? "p-2" : "p-3",
        )}
      >
        <button
          onClick={handleLogout}
          title={collapsed && !isMobile ? "退出登录" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl text-[13px] w-full transition-colors",
            "text-muted-foreground hover:text-destructive hover:bg-[rgba(245,198,208,0.08)]",
            isMobile
              ? "px-3 py-2.5"
              : collapsed
                ? "px-2.5 py-2.5 justify-center"
                : "px-3 py-2.5",
          )}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {(isMobile || !collapsed) && <span>退出登录</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30",
          "backdrop-blur-2xl border-r transition-all duration-300 ease-in-out",
          "bg-[rgba(255,255,255,0.72)] border-[rgba(168,230,225,0.2)]",
          "dark:bg-[rgba(13,13,26,0.85)] dark:border-dark-card-hover",
          collapsed ? "lg:w-17" : "lg:w-62",
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "hidden lg:flex items-center justify-center",
          "fixed top-4 z-40",
          "w-7 h-7 rounded-full backdrop-blur-xl border transition-all duration-300",
          "bg-[rgba(255,255,255,0.8)] border-light-border",
          "hover:bg-[rgba(255,255,255,0.95)] hover:shadow-md",
          "dark:bg-[rgba(13,13,26,0.85)] dark:border-dark-border dark:hover:bg-[rgba(13,13,26,0.95)]",
          collapsed ? "left-14" : "left-59",
        )}
      >
        {collapsed ? (
          <PanelLeft className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <PanelLeftClose className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-40",
          "w-10 h-10 rounded-xl backdrop-blur-xl border flex items-center justify-center",
          "bg-[rgba(255,255,255,0.8)] border-light-border",
          "dark:bg-[rgba(13,13,26,0.85)] dark:border-dark-border",
        )}
      >
        <PanelLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={cn(
              "fixed inset-y-0 left-0 w-66 z-50 shadow-2xl",
              "backdrop-blur-2xl border-r",
              "bg-[rgba(255,255,255,0.95)] border-[rgba(168,230,225,0.2)]",
              "dark:bg-[rgba(13,13,26,0.95)] dark:border-dark-card-hover",
            )}
          >
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
