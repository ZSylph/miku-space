"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Disc3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteButton from "./DeleteButton";

interface SongItem {
  id: string;
  title: string;
  artist: string;
  order: number;
  duration: number;
  active: boolean;
  lyrics: string | null;
}

const cardBase = cn(
  "rounded-2xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.07)]"
);

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SongDragList({ songs: initialSongs }: { songs: SongItem[] }) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dragCounter = useRef(new Map<string, number>());

  const persistOrder = useCallback(
    async (reordered: SongItem[]) => {
      setSaving(true);
      const orders = reordered.map((s, i) => ({ id: s.id, order: i }));
      try {
        const res = await fetch("/api/songs/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orders }),
        });
        if (!res.ok) {
          console.error("Reorder failed");
          router.refresh();
        }
      } catch {
        console.error("Reorder request error");
        router.refresh();
      } finally {
        setSaving(false);
      }
    },
    [router]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      setDragId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    []
  );

  const handleDragEnter = useCallback((id: string) => {
    setOverId(id);
    const count = dragCounter.current.get(id) ?? 0;
    dragCounter.current.set(id, count + 1);
  }, []);

  const handleDragLeave = useCallback((id: string) => {
    const count = (dragCounter.current.get(id) ?? 1) - 1;
    dragCounter.current.set(id, count);
    if (count <= 0) {
      dragCounter.current.delete(id);
      setOverId((prev) => (prev === id ? null : prev));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDragId(null);
        setOverId(null);
        dragCounter.current.clear();
        return;
      }

      setSongs((prev) => {
        const srcIdx = prev.findIndex((s) => s.id === sourceId);
        const tgtIdx = prev.findIndex((s) => s.id === targetId);
        if (srcIdx < 0 || tgtIdx < 0) return prev;

        const next = [...prev];
        const [moved] = next.splice(srcIdx, 1);
        next.splice(tgtIdx, 0, moved);

        // Persist in background
        persistOrder(next);

        return next;
      });

      setDragId(null);
      setOverId(null);
      dragCounter.current.clear();
    },
    [persistOrder]
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setOverId(null);
    dragCounter.current.clear();
  }, []);

  return (
    <div className="grid gap-2">
      {songs.map((song) => (
        <div
          key={song.id}
          draggable
          onDragStart={(e) => handleDragStart(e, song.id)}
          onDragEnter={() => handleDragEnter(song.id)}
          onDragLeave={() => handleDragLeave(song.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, song.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            cardBase,
            "p-4 group transition-all duration-200",
            dragId === song.id && "opacity-40 scale-[0.98]",
            overId === song.id && dragId !== song.id &&
              "ring-2 ring-miku-primary/40 -translate-y-0.5",
            dragId !== song.id && "hover:-translate-y-0.5"
          )}
          style={{ cursor: "grab" }}
        >
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <div className="flex items-center pt-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Disc3 className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                <h3 className="font-semibold text-foreground truncate">
                  {song.title}
                </h3>
                <span className="text-xs text-muted-foreground truncate flex-shrink-0">
                  {song.artist}
                </span>
                {song.active ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    启用
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-500/10 px-2 py-0.5 text-[11px] font-medium text-gray-500 flex-shrink-0">
                    <XCircle className="w-3 h-3" />
                    禁用
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 mt-1">
                <span className="font-mono">{formatDuration(song.duration)}</span>
                {song.lyrics && (
                  <span className="text-miku-primary-dark">有歌词</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/admin/songs/${song.id}/edit`}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-miku-primary-dark hover:bg-miku-primary/10 transition-colors"
              >
                编辑
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <DeleteButton apiPath={`/api/songs/${song.id}`} itemName="歌曲" />
            </div>
          </div>
        </div>
      ))}

      {saving && (
        <p className="text-center text-xs text-muted-foreground/50 py-1">
          排序保存中...
        </p>
      )}
    </div>
  );
}
