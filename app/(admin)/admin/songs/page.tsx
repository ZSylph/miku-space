import { prisma } from "@/lib/prisma";
import AdminListHeader from "@/components/admin/AdminListHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import CleanupButton from "@/components/admin/CleanupButton";
import SongDragList from "@/components/admin/SongDragList";
import {
  Music,
  Disc3,
} from "lucide-react";

export default async function SongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { order: "asc" },
  });

  const activeCount = songs.filter((s) => s.active).length;

  return (
    <div className="space-y-5">
      <AdminListHeader
        icon={<Music className="w-5 h-5 text-violet-500" />}
        iconClassName="bg-violet-500/10 dark:bg-violet-500/15"
        title="歌曲管理"
        subtitle={`共 ${songs.length} 首 · ${activeCount} 首启用 · 拖拽排序`}
        actionHref="/admin/songs/new"
        actionLabel="添加歌曲"
        extraActions={<CleanupButton />}
      />

      {songs.length === 0 ? (
        <AdminEmptyState
          icon={<Disc3 className="w-10 h-10" />}
          message="还没有歌曲，点击上方按钮添加"
          actionHref="/admin/songs/new"
          actionLabel="添加歌曲"
        />
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
