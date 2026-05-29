"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s一-龥-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass = cn(
  "w-full rounded-2xl border px-3.5 py-2.5 text-sm",
  "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
  "placeholder:text-muted-foreground/50",
  "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
);

export default function NewWorkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const slugRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      coverUrl: formData.get("coverUrl") as string,
      demoUrl: formData.get("demoUrl") as string,
      repoUrl: formData.get("repoUrl") as string,
      featured: formData.get("featured") === "on",
      order: parseInt(formData.get("order") as string) || 0,
    };

    const res = await fetch("/api/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/works");
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
        <h1 className="text-[28px] font-bold text-foreground">新建作品</h1>
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
              onChange={(e) => {
                if (slugRef.current && !slugRef.current.value) {
                  slugRef.current.value = slugify(e.target.value);
                }
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              ref={slugRef}
              name="slug"
              type="text"
              required
              placeholder="my-project"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">简介</label>
            <textarea
              name="description"
              rows={2}
              required
              placeholder="简短描述作品"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">封面图</label>
            <ImageUpload name="coverUrl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">演示链接</label>
            <input
              name="demoUrl"
              type="url"
              placeholder="https://demo.example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">仓库链接</label>
            <input
              name="repoUrl"
              type="url"
              placeholder="https://github.com/..."
              className={inputClass}
            />
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
          <div>
            <label className="block text-sm font-medium mb-2">详细内容（Markdown）</label>
            <textarea
              name="content"
              rows={8}
              placeholder="支持 Markdown 格式"
              className={cn(inputClass, "font-mono")}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              className="w-4 h-4 rounded border border-[rgba(168,230,225,0.3)] accent-miku-primary-dark"
            />
            <label htmlFor="featured" className="text-sm">
              设为精选（首页展示）
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
              {loading ? "创建中..." : "创建作品"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/works")}
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
