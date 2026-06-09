"use client";

import { useState } from "react";
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

export default function NewInterestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      active: formData.get("active") === "on",
    };

    const res = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/interests");
      router.refresh();
    } else {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "创建失败");
    }
  }

  return (
    <AdminFormLayout
      title="新建兴趣"
      breadcrumb={{ label: "兴趣管理", href: "/admin/interests" }}
      error={error}
      onDismissError={() => setError("")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={adminLabelClass}>标题</label>
          <input name="title" type="text" required className={adminInputClass} />
        </div>
        <div>
          <label className={adminLabelClass}>描述</label>
          <textarea name="description" rows={2} required className={adminInputClass} />
        </div>
        <div>
          <label className={adminLabelClass}>图片</label>
          <ImageUpload name="imageUrl" type="image" />
        </div>
        <div className="flex items-center gap-2.5">
          <input
            name="active"
            type="checkbox"
            id="active"
            defaultChecked
            className={adminCheckboxClass}
          />
          <label htmlFor="active" className="text-sm">
            启用（前台展示）
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "创建中..." : "创建兴趣"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/interests")}
            className={adminSecondaryButton}
          >
            取消
          </button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
