"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "@prisma/client";
import { Jsonified } from "@/lib/types";
import { parseTags } from "@/lib/utils";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/lib/admin-styles";

type PostApi = Jsonified<Post>;

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState<PostApi | null>(null);
  const [fetching, setFetching] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: PostApi) => {
        setPost(data);
        setContent(data.content);
        setFetching(false);
      })
      .catch(() => {
        setError("加载文章失败");
        setFetching(false);
      });
  }, [id]);

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
      const result = await res.json().catch(() => ({}));
      setError(result.error || "更新失败");
    }
  }

  if (fetching) {
    return (
      <div className="text-muted-foreground py-16 text-center text-sm">
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <AdminFormLayout
        title="加载失败"
        breadcrumb={{ label: "文章管理", href: "/admin/posts" }}
        error={error || "无法加载文章数据"}
      >
        <button
          onClick={() => router.push("/admin/posts")}
          className={adminSecondaryButton}
        >
          返回文章列表
        </button>
      </AdminFormLayout>
    );
  }

  return (
    <AdminFormLayout
      title="编辑文章"
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
            defaultValue={post.title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Slug</label>
          <input
            name="slug"
            type="text"
            required
            defaultValue={post.slug}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>标签</label>
          <input
            name="tags"
            type="text"
            defaultValue={parseTags(post.tags).join(", ")}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>封面图</label>
          <ImageUpload name="coverUrl" defaultValue={post.coverUrl || ""} />
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
              defaultChecked={post.published}
              className={adminCheckboxClass}
            />
            <label htmlFor="published" className="text-sm">
              已发布
            </label>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              name="featured"
              type="checkbox"
              id="featured"
              defaultChecked={post.featured}
              className={adminCheckboxClass}
            />
            <label htmlFor="featured" className="text-sm">
              精选（首页展示）
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "保存中..." : "保存修改"}
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
