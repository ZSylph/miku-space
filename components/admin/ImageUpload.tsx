"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, Loader2, Music } from "lucide-react";

interface FileUploadProps {
  name: string;
  defaultValue?: string;
  type?: "image" | "audio";
  accept?: string;
  onUrlChange?: (url: string) => void;
}

export default function ImageUpload({
  name,
  defaultValue = "",
  type = "image",
  accept,
  onUrlChange,
}: FileUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  const isAudio = type === "audio";
  const defaultAccept = isAudio ? "audio/*" : "image/*";

  function updateUrl(newUrl: string) {
    setUrl(newUrl);
    onUrlChange?.(newUrl);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", isAudio ? "audio" : "image");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        updateUrl(data.url);
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
        onChange={(e) => updateUrl(e.target.value)}
        placeholder={isAudio ? "音频文件 URL" : "https://example.com/image.jpg"}
        className={cn(
          "w-full rounded-xl border px-3.5 py-2.5 text-sm",
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
          ) : isAudio ? (
            <Music className="w-3.5 h-3.5" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "上传中..." : isAudio ? "选择音频文件" : "选择文件上传"}
          <input
            type="file"
            accept={accept || defaultAccept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {isAudio && (
          <span className="text-[11px] text-muted-foreground">
            支持 MP3、WAV、OGG、M4A、FLAC，最大 30MB
          </span>
        )}
      </div>
      {!isAudio && url && (
        <Image
          src={url}
          alt="预览"
          width={128}
          height={128}
          className="w-32 h-32 object-cover rounded-2xl border border-[rgba(168,230,225,0.2)]"
        />
      )}
      {isAudio && url && (
        <audio src={url} controls className="w-full h-10 rounded-lg" />
      )}
    </div>
  );
}
