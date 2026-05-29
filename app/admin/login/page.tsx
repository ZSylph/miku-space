"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("用户名或密码错误");
      }
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = cn(
    "w-full rounded-2xl border px-10 py-2.5 text-sm",
    "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
    "placeholder:text-muted-foreground/50",
    "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
    "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
  );

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-[#FFF5F7] dark:bg-[#0D0D1A]"
      )}
    >
      <div
        className={cn(
          "w-full max-w-sm p-8 rounded-3xl backdrop-blur-xl border",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-miku-primary/20 mb-4">
            <Lock className="w-6 h-6 text-miku-primary-dark" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">管理后台</h1>
          <p className="text-sm text-muted-foreground mt-1">请输入管理员账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名"
              className={inputClass}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className={inputClass}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm font-medium",
              "bg-miku-primary text-primary-foreground",
              "hover:bg-miku-primary-dark disabled:opacity-50 transition-colors",
              "inline-flex items-center justify-center gap-2"
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
