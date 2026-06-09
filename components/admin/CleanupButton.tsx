"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CleanupButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleCleanup() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/uploads/cleanup", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(
          data.deleted === 0
            ? "没有孤立文件"
            : `已清理 ${data.deleted} 个文件`
        );
      } else {
        setResult(data.error || "清理失败");
      }
    } catch {
      setResult("请求失败");
    }
    setLoading(false);
    setTimeout(() => setResult(null), 3000);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCleanup}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium",
          "border border-gray-300/50 dark:border-gray-600/30",
          "text-muted-foreground hover:text-foreground hover:bg-gray-100/50 dark:hover:bg-gray-800/30",
          "transition-colors disabled:opacity-50"
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
        {loading ? "清理中..." : "清理孤立文件"}
      </button>
      {result && (
        <span className="text-xs text-muted-foreground">{result}</span>
      )}
    </div>
  );
}
