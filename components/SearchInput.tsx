"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜索文章、笔记、作品..."
          className={cn(
            "w-full rounded-2xl border px-10 py-2.5 text-sm",
            "bg-[rgba(168,230,225,0.08)] border-[rgba(168,230,225,0.2)]",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
            "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium",
          "bg-miku-primary text-primary-foreground",
          "hover:bg-miku-primary-dark transition-colors"
        )}
      >
        搜索
      </button>
    </form>
  );
}
