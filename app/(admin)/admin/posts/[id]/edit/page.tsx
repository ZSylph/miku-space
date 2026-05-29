"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";
import { Jsonified } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

type PostApi = Jsonified<Post>;

const inputClass = cn(
  "w-full rounded-2xl border px-3.5 py-2.5 text-sm",
  "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
  "placeholder:text-muted-foreground/50",
  "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
);

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostApi | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: PostApi) => {
        setPost(data);
        setFetching(false);
      })
      .catch(() => {
        alert("加载文章失败");
        router.push("/admin/posts");
      });
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      coverUrl: formData.get("coverUrl") as string,
      published: formData.get("published") === "on",
    };

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/posts");
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
        <h1 className="text-[28px] font-bold text-foreground">编辑文章</h1>
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
              defaultValue={post?.title}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              name="slug"
              type="text"
              required
              defaultValue={post?.slug}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">摘要</label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt || ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">封面图</label>
            <ImageUpload name="coverUrl" defaultValue={post?.coverUrl || ""} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">正文内容</label>
            <textarea
              name="content"
              rows={12}
              required
              defaultValue={post?.content}
              className={cn(inputClass, "font-mono")}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="published"
              type="checkbox"
              id="published"
              defaultChecked={post?.published}
              className="w-4 h-4 rounded border border-[rgba(168,230,225,0.3)] accent-miku-primary-dark"
            />
            <label htmlFor="published" className="text-sm">
              已发布
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
              onClick={() => router.push("/admin/posts")}
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
