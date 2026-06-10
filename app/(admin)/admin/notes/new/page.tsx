"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminSubmit } from "@/components/admin/useAdminSubmit";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/components/admin/styles";
import { makeSlug } from "@/lib/utils";

export default function NewNotePage() {
  const router = useRouter();
  const { loading, error, setError, submit } = useAdminSubmit({
    apiPath: "/api/notes",
    redirectPath: "/admin/notes",
  });
  const [content, setContent] = useState("");
  const slugRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    await submit({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      tags,
      coverUrl: formData.get("coverUrl") as string,
      published: formData.get("published") === "on",
    });
  }

  return (
    <AdminFormLayout
      title="新建笔记"
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
            placeholder="my-first-note"
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
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "创建中..." : "创建笔记"}
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
