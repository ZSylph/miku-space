"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Work } from "@prisma/client";
import { Jsonified } from "@/lib/types";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/components/admin/styles";

type WorkApi = Jsonified<Work>;

export default function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        setError("加载作品失败");
        setFetching(false);
      });
  }, [id]);

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

  if (!work) {
    return (
      <AdminFormLayout
        title="加载失败"
        breadcrumb={{ label: "作品管理", href: "/admin/works" }}
        error={error || "无法加载作品数据"}
      >
        <button
          onClick={() => router.push("/admin/works")}
          className={adminSecondaryButton}
        >
          返回作品列表
        </button>
      </AdminFormLayout>
    );
  }

  return (
    <AdminFormLayout
      title="编辑作品"
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
            defaultValue={work.title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Slug</label>
          <input
            name="slug"
            type="text"
            required
            defaultValue={work.slug}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>简介</label>
          <textarea
            name="description"
            rows={2}
            required
            defaultValue={work.description}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>封面图</label>
          <ImageUpload name="coverUrl" defaultValue={work.coverUrl || ""} />
        </div>
        <div>
          <label className={adminLabelClass}>仓库链接</label>
          <input
            name="repoUrl"
            type="url"
            defaultValue={work.repoUrl || ""}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>技术栈</label>
          <input
            name="techStack"
            type="text"
            defaultValue={(() => { try { return (JSON.parse(work.techStack) as string[]).join(", "); } catch { return ""; } })()}
            placeholder="用逗号分隔，如：React, Next.js, Tailwind CSS"
            className={adminInputClass}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <input
            name="featured"
            type="checkbox"
            id="featured"
            defaultChecked={work.featured}
            className={adminCheckboxClass}
          />
          <label htmlFor="featured" className="text-sm">
            设为精选（首页展示）
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "保存中..." : "保存修改"}
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
