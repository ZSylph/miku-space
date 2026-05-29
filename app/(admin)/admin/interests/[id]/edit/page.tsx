"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Interest } from "@prisma/client";
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

export default function EditInterestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState<Interest | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/interests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Interest) => {
        setInterest(data);
        setFetching(false);
      })
      .catch(() => {
        alert("加载兴趣数据失败");
        router.push("/admin/interests");
      });
  }, [id, router]);

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

    const res = await fetch(`/api/interests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/interests");
      router.refresh();
    } else {
      const error = await res.json();
      alert(error.error || "更新失败");
    }
  }

  if (fetching) {
    return (
      <div className="text-muted-foreground py-12 text-center">加载中...</div>
    );
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
        <h1 className="text-[28px] font-bold text-foreground">编辑兴趣</h1>
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
              defaultValue={interest?.title}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">描述</label>
            <textarea
              name="description"
              rows={2}
              required
              defaultValue={interest?.description}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">图标（Lucide 名称）</label>
            <input
              name="icon"
              type="text"
              required
              defaultValue={interest?.icon}
              placeholder="e.g. Code, Palette, Music"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">颜色</label>
            <select
              name="color"
              required
              defaultValue={interest?.color}
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
              defaultValue={interest?.order}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="active"
              type="checkbox"
              id="active"
              defaultChecked={interest?.active}
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
              {loading ? "保存中..." : "保存修改"}
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
