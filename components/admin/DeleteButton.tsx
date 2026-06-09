"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteButtonProps {
  apiPath: string;
  itemName: string;
  variant?: "text" | "button";
}

export default function DeleteButton({
  apiPath,
  itemName,
  variant = "text",
}: DeleteButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setError("");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(apiPath, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "删除失败");
        setConfirming(false);
      }
    } catch {
      setError("网络错误，请重试");
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-xs text-muted-foreground">确定删除?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {deleting ? "删除中" : "确认"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-[rgba(168,230,225,0.08)] transition-colors"
        >
          取消
        </button>
        {error && (
          <span className="text-xs text-red-500 ml-1">{error}</span>
        )}
      </span>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleDelete}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium",
          "text-destructive hover:bg-[rgba(245,198,208,0.1)] transition-colors"
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
        删除{itemName}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-destructive/70 hover:text-destructive transition-colors"
    >
      删除
    </button>
  );
}
