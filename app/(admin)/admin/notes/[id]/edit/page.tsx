"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Note } from "@prisma/client";
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

type NoteApi = Jsonified<Note>;

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState<NoteApi | null>(null);
  const [fetching, setFetching] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: NoteApi) => {
        setNote(data);
        setContent(data.content);
        setFetching(false);
      })
      .catch(() => {
        setError("加载笔记失败");
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
    };

    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/notes");
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

  if (!note) {
    return (
      <AdminFormLayout
        title="加载失败"
        breadcrumb={{ label: "笔记管理", href: "/admin/notes" }}
        error={error || "无法加载笔记数据"}
      >
        <button
          onClick={() => router.push("/admin/notes")}
          className={adminSecondaryButton}
        >
          返回笔记列表
        </button>
      </AdminFormLayout>
    );
  }

  return (
    <AdminFormLayout
      title="编辑笔记"
      breadcrumb={{ label: "笔记管理", href: "/admin/notes" }}
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
            defaultValue={note.title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Slug</label>
          <input
            name="slug"
            type="text"
            required
            defaultValue={note.slug}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>标签</label>
          <input
            name="tags"
            type="text"
            defaultValue={parseTags(note.tags).join(", ")}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>封面图</label>
          <ImageUpload name="coverUrl" defaultValue={note.coverUrl || ""} />
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
        <div className="flex items-center gap-2.5">
          <input
            name="published"
            type="checkbox"
            id="published"
            defaultChecked={note.published}
            className={adminCheckboxClass}
          />
          <label htmlFor="published" className="text-sm">
            已发布
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "保存中..." : "保存修改"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/notes")}
            className={adminSecondaryButton}
          >
            取消
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
