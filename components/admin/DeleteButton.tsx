"use client";

import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  apiPath: string;
  itemName: string;
}

export default function DeleteButton({ apiPath, itemName }: DeleteButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`确定要删除这个${itemName}吗？此操作不可撤销。`)) {
      return;
    }

    const res = await fetch(apiPath, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("删除失败");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-destructive hover:underline"
    >
      删除
    </button>
  );
}
