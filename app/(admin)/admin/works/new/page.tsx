"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewWorkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const slugRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const techStackRaw = (formData.get("techStack") as string) || "";
    const techStack = techStackRaw
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      coverUrl: formData.get("coverUrl") as string,
      repoUrl: formData.get("repoUrl") as string,
      techStack,
      featured: formData.get("featured") === "on",
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
      const result = await res.json().catch(() => ({}));
      setError(result.error || "创建失败");
    }
  }

  return (
    <AdminFormLayout
      title="新建作品"
      breadcrumb={{ label: "作品管理", href: "/admin/works" }}
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
            placeholder="my-project"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>简介</label>
          <textarea
            name="description"
            rows={2}
            required
            placeholder="简短描述作品"
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>封面图</label>
          <ImageUpload name="coverUrl" />
        </div>
        <div>
          <label className={adminLabelClass}>仓库链接</label>
          <input
            name="repoUrl"
            type="url"
            placeholder="https://github.com/..."
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>技术栈</label>
          <input
            name="techStack"
            type="text"
            placeholder="用逗号分隔，如：React, Next.js, Tailwind CSS"
            className={adminInputClass}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <input
            name="featured"
            type="checkbox"
            id="featured"
            className={adminCheckboxClass}
          />
          <label htmlFor="featured" className="text-sm">
            设为精选（首页展示）
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "创建中..." : "创建作品"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/works")}
            className={adminSecondaryButton}
          >
            取消
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
