"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const colorOptions = [
  "blue", "pink", "green", "purple", "orange", "red", "yellow", "gray",
];

const inputClass = cn(
  "w-full rounded-2xl border px-3.5 py-2.5 text-sm",
  "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
  "placeholder:text-muted-foreground/50",
  "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
);

export default function NewInterestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      color: formData.get("color") as string,
      order: parseInt(formData.get("order") as string) || 0,
      active: formData.get("active") === "on",
    };

    const res = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/interests");
      router.refresh();
    } else {
      const error = await res.json();
      alert(error.error || "创建失败");
    }
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">新建兴趣</h1>
      </div>

      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6 md:p-8 max-w-2xl",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">标题</label>
            <input
              name="title"
              type="text"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">描述</label>
            <textarea
              name="description"
              rows={2}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">图标（Lucide 名称）</label>
            <input
              name="icon"
              type="text"
              required
              placeholder="e.g. Code, Palette, Music"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">颜色</label>
            <select
              name="color"
              required
              className={cn(inputClass, "appearance-none")}
            >
              {colorOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">排序序号</label>
            <input
              name="order"
              type="number"
              defaultValue="0"
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="active"
              type="checkbox"
              id="active"
              defaultChecked
              className="w-4 h-4 rounded border border-[rgba(168,230,225,0.3)] accent-miku-primary-dark"
            />
            <label htmlFor="active" className="text-sm">
              启用（前台展示）
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium",
                "bg-miku-primary text-primary-foreground",
                "hover:bg-miku-primary-dark disabled:opacity-50 transition-colors"
              )}
            >
              {loading ? "创建中..." : "创建兴趣"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/interests")}
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium",
                "border border-[rgba(168,230,225,0.3)]",
                "hover:bg-[rgba(168,230,225,0.1)] transition-colors",
                "dark:border-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.04)]"
              )}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
