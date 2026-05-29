"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUpload({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setUrl(data.url);
      } else {
        alert(data.error || "上传失败");
      }
    } catch {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        name={name}
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className={cn(
          "w-full rounded-2xl border px-3.5 py-2.5 text-sm",
          "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
        )}
      />
      <div className="flex items-center gap-3">
        <label
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium cursor-pointer",
            "border border-[rgba(168,230,225,0.3)]",
            "hover:bg-[rgba(168,230,225,0.1)] transition-colors",
            "dark:border-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.04)]"
          )}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "上传中..." : "选择文件上传"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {url && (
        <Image
          src={url}
          alt="预览"
          width={128}
          height={128}
          className="w-32 h-32 object-cover rounded-2xl border border-[rgba(168,230,225,0.2)]"
        />
      )}
    </div>
  );
}
