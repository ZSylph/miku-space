"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import AdminFormLayout from "@/components/admin/AdminFormLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";
import { parseLyrics } from "@/lib/lyrics";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButton,
  adminSecondaryButton,
  adminCheckboxClass,
} from "@/lib/admin-styles";

export default function NewSongPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lyricsText, setLyricsText] = useState("");
  const [detectingDuration, setDetectingDuration] = useState(false);
  const durationRef = useRef<HTMLInputElement>(null);
  const lrcInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUrlChange = useCallback((url: string) => {
    if (!url) return;
    setDetectingDuration(true);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      const dur = Math.round(audio.duration);
      if (durationRef.current && dur > 0 && isFinite(dur)) {
        durationRef.current.value = String(dur);
      }
      setDetectingDuration(false);
    });
    audio.addEventListener("error", () => {
      setDetectingDuration(false);
    });
  }, []);

  function handleLrcFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setLyricsText(text);
    };
    reader.readAsText(file, "utf-8");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      artist: formData.get("artist") as string,
      audioUrl: formData.get("audioUrl") as string,
      coverUrl: formData.get("coverUrl") as string,
      duration: parseInt(formData.get("duration") as string) || 0,
      active: formData.get("active") === "on",
      lyrics: parseLyrics(lyricsText),
    };

    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/songs");
      router.refresh();
    } else {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "创建失败");
    }
  }

  return (
    <AdminFormLayout
      title="添加歌曲"
      breadcrumb={{ label: "歌曲管理", href: "/admin/songs" }}
      error={error}
      onDismissError={() => setError("")}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={adminLabelClass}>歌曲标题</label>
            <input
              name="title"
              type="text"
              required
              placeholder="World is Mine"
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>艺术家</label>
            <input
              name="artist"
              type="text"
              required
              placeholder="ryo (supercell)"
              className={adminInputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={adminLabelClass}>音频文件</label>
            <ImageUpload name="audioUrl" type="audio" onUrlChange={handleAudioUrlChange} />
          </div>
          <div>
            <label className={adminLabelClass}>封面图（可选）</label>
            <ImageUpload name="coverUrl" type="image" />
          </div>
        </div>

        <div>
          <label className={adminLabelClass}>
            时长（秒）
            {detectingDuration && (
              <span className="ml-2 text-xs text-miku-primary-dark font-normal">
                检测中...
              </span>
            )}
          </label>
          <input
            ref={durationRef}
            name="duration"
            type="number"
            defaultValue="0"
            placeholder="自动获取"
            className={adminInputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={cn(adminLabelClass, "mb-0")}>歌词（可选）</label>
            <div className="flex items-center gap-2">
              <input
                ref={lrcInputRef}
                type="file"
                accept=".lrc,.txt"
                onChange={handleLrcFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => lrcInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                上传 .lrc 文件
              </button>
            </div>
          </div>
          <textarea
            value={lyricsText}
            onChange={(e) => setLyricsText(e.target.value)}
            rows={4}
            placeholder={"支持 LRC 格式，例如：\n[00:12.50]世界で一番おひめさま\n[00:16.20]そういう扱い 心得てよね"}
            className={cn(adminInputClass, "font-mono text-xs")}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <input
              name="active"
              type="checkbox"
              id="active"
              defaultChecked
              className={adminCheckboxClass}
            />
            <label htmlFor="active" className="text-sm">
              启用
            </label>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/admin/songs")}
              className={adminSecondaryButton}
            >
              取消
            </button>
            <button type="submit" disabled={loading} className={adminPrimaryButton}>
              {loading ? "添加中..." : "添加歌曲"}
            </button>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  );
}
