"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "仪表板" },
  { href: "/admin/posts", label: "文章" },
  { href: "/admin/notes", label: "笔记" },
  { href: "/admin/works", label: "作品" },
  { href: "/admin/interests", label: "兴趣" },
];

export default function AdminNavbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/admin" className="font-bold">
          管理后台
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  );
}
