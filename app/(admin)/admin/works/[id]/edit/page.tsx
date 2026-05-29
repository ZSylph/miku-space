"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Work } from "@prisma/client";
import { Jsonified } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

type WorkApi = Jsonified<Work>;

const inputClass = cn(
  "w-full rounded-2xl border px-3.5 py-2.5 text-sm",
  "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
  "placeholder:text-muted-foreground/50",
  "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
);

export default function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [work, setWork] = useState<WorkApi | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/works/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: WorkApi) => {
        setWork(data);
        setFetching(false);
      })
      .catch(() => {
        alert("加载作品失败");
        router.push("/admin/works");
      });
  }, [id, router]);

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

    const res = await fetch(`/api/works/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/works");
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
        <h1 className="text-[28px] font-bold text-foreground">编辑作品</h1>
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
              defaultValue={work?.title}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              name="slug"
              type="text"
              required
              defaultValue={work?.slug}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">简介</label>
            <textarea
              name="description"
              rows={2}
              required
              defaultValue={work?.description}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">封面图</label>
            <ImageUpload name="coverUrl" defaultValue={work?.coverUrl || ""} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">演示链接</label>
            <input
              name="demoUrl"
              type="url"
              defaultValue={work?.demoUrl || ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">仓库链接</label>
            <input
              name="repoUrl"
              type="url"
              defaultValue={work?.repoUrl || ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">排序序号</label>
            <input
              name="order"
              type="number"
              defaultValue={work?.order}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">详细内容（Markdown）</label>
            <textarea
              name="content"
              rows={8}
              defaultValue={work?.content || ""}
              className={cn(inputClass, "font-mono")}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              defaultChecked={work?.featured}
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
              {loading ? "保存中..." : "保存修改"}
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
