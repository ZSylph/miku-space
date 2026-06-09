"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/lib/admin-styles";

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const slugRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      tags,
      coverUrl: formData.get("coverUrl") as string,
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "创建失败");
    }
  }

  return (
    <AdminFormLayout
      title="新建文章"
      breadcrumb={{ label: "文章管理", href: "/admin/posts" }}
      error={error}
      onDismissError={() => setError("")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={adminLabelClass}>标题</label>
          <input
            name="title"
            type="text"
            required
            onChange={(e) => {
              if (slugRef.current && !slugRef.current.value) {
                slugRef.current.value = makeSlug(e.target.value);
              }
            }}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Slug</label>
          <input
            ref={slugRef}
            name="slug"
            type="text"
            required
            placeholder="my-first-post"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>标签</label>
          <input
            name="tags"
            type="text"
            placeholder="用逗号分隔，如：前端, React, TypeScript"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>封面图</label>
          <ImageUpload name="coverUrl" />
        </div>
        <div>
          <label className={adminLabelClass}>正文内容</label>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="content"
              rows={14}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="支持 Markdown 格式"
              className={`${adminInputClass} font-mono`}
            />
            <div
              className={`rounded-lg border border-white/10 bg-white/5 p-3 overflow-y-auto ${adminInputClass}`}
              style={{ minHeight: "21rem" }}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <input
              name="published"
              type="checkbox"
              id="published"
              className={adminCheckboxClass}
            />
            <label htmlFor="published" className="text-sm">
              立即发布
            </label>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              className={adminCheckboxClass}
            />
            <label htmlFor="featured" className="text-sm">
              精选（首页展示）
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "创建中..." : "创建文章"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className={adminSecondaryButton}
          >
            取消
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
