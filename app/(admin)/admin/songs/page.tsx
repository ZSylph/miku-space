import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/lib/admin-styles";
import CleanupButton from "@/components/admin/CleanupButton";
import SongDragList from "@/components/admin/SongDragList";
import {
  Music,
  Plus,
  Disc3,
} from "lucide-react";

export default async function SongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { order: "asc" },
  });

  const activeCount = songs.filter((s) => s.active).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={cn(adminCardBase, "p-5")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center">
              <Music className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">歌曲管理</h1>
              <p className="text-xs text-muted-foreground">
                共 {songs.length} 首 · {activeCount} 首启用 · 拖拽排序
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CleanupButton />
            <Link
              href="/admin/songs/new"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium",
                "bg-miku-primary text-primary-foreground",
                "hover:bg-miku-primary-dark transition-colors"
              )}
            >
              <Plus className="w-4 h-4" />
              添加歌曲
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      {songs.length === 0 ? (
        <div className={cn(adminCardBase, "p-12 text-center")}>
          <Disc3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">还没有歌曲，点击上方按钮添加</p>
          <Link
            href="/admin/songs/new"
            className="text-sm text-miku-primary-dark hover:underline"
          >
            添加歌曲
          </Link>
        </div>
      ) : (
        <SongDragList
          songs={songs.map((s) => ({
            id: s.id,
            title: s.title,
            artist: s.artist,
            order: s.order,
            duration: s.duration,
            active: s.active,
            lyrics: s.lyrics,
          }))}
        />
      )}
    </div>
  );
}
