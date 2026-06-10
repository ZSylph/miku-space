"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Interest } from "@prisma/client";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/components/admin/styles";

export default function EditInterestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interest, setInterest] = useState<Interest | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/interests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Interest) => {
        setInterest(data);
        setFetching(false);
      })
      .catch(() => {
        setError("加载兴趣数据失败");
        setFetching(false);
      });
  }, [id]);

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

    const res = await fetch(`/api/interests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/interests");
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

  if (!interest) {
    return (
      <AdminFormLayout
        title="加载失败"
        breadcrumb={{ label: "兴趣管理", href: "/admin/interests" }}
        error={error || "无法加载兴趣数据"}
      >
        <button
          onClick={() => router.push("/admin/interests")}
          className={adminSecondaryButton}
        >
          返回兴趣列表
        </button>
      </AdminFormLayout>
    );
  }

  return (
    <AdminFormLayout
      title="编辑兴趣"
      breadcrumb={{ label: "兴趣管理", href: "/admin/interests" }}
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
            defaultValue={interest.title}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>描述</label>
          <textarea
            name="description"
            rows={2}
            required
            defaultValue={interest.description}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass}>图片</label>
          <ImageUpload name="imageUrl" type="image" defaultValue={interest.imageUrl || ""} />
        </div>
        <div className="flex items-center gap-2.5">
          <input
            name="active"
            type="checkbox"
            id="active"
            defaultChecked={interest.active}
            className={adminCheckboxClass}
          />
          <label htmlFor="active" className="text-sm">
            启用（前台展示）
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={adminPrimaryButton}>
            {loading ? "保存中..." : "保存修改"}
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
