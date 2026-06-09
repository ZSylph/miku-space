"use client";

import { useCallback, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  ListMusic,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn, formatTime } from "@/lib/utils";
import { useMusic } from "./MusicProvider";

export default function MiniPlayer() {
  const {
    songs,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seekTo,
    playIndex,
  } = useMusic();
  const progressRef = useRef<HTMLDivElement>(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const effectiveDuration = duration || currentSong?.duration || 1;
  const progressPercent = Math.min(
    (currentTime / effectiveDuration) * 100,
    100,
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      seekTo(pct * effectiveDuration);
    },
    [effectiveDuration, seekTo],
  );

  if (!currentSong) {
    return (
      <div className="flex items-center gap-3 py-2 text-muted-foreground">
        <Music className="w-5 h-5 opacity-40" />
        <span className="text-xs">暂无歌曲</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          音乐
        </span>
        <button
          onClick={() => setPlaylistOpen(!playlistOpen)}
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] transition-colors",
            playlistOpen
              ? "bg-miku-primary/15 text-miku-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.1)]",
          )}
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>{songs.length}</span>
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-200",
              playlistOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Track info row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-linear-to-br from-miku-primary/30 to-miku-primary-light/20 flex items-center justify-center shadow-[0_2px_8px_rgba(168,230,225,0.2)]">
          {currentSong.coverUrl ? (
            <Image
              src={currentSong.coverUrl}
              alt={currentSong.title}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <Music
              className={cn(
                "w-4 h-4 text-miku-primary",
                isPlaying && "animate-pulse",
              )}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-foreground truncate leading-tight">
            {currentSong.title}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {currentSong.artist}
          </p>
        </div>
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3.5 shrink-0">
            <span
              className="w-0.5 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"
              style={{ height: "45%" }}
            />
            <span
              className="w-0.5 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.15s]"
              style={{ height: "100%" }}
            />
            <span
              className="w-0.5 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.3s]"
              style={{ height: "35%" }}
            />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        className="w-full h-1.5 rounded-full cursor-pointer group bg-light-border overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-miku-primary to-miku-primary-light transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground -mt-0.5">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(effectiveDuration)}</span>
      </div>

      {/* Controls — prev, play/pause, next */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="上一首"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-light-card active:scale-95"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "暂停" : "播放"}
          className="w-10 h-10 rounded-full bg-linear-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-dark-base shadow-[0_2px_12px_rgba(168,230,225,0.3)] transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        <button
          onClick={next}
          aria-label="下一首"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-light-card active:scale-95"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable playlist */}
      <AnimatePresence>
        {playlistOpen && songs.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[rgba(168,230,225,0.12)] dark:border-dark-card-hover pt-2 mt-1 space-y-0.5 max-h-50 overflow-y-auto scrollbar-none">
              {songs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => playIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors",
                    index === currentIndex
                      ? "bg-miku-primary/12 text-foreground"
                      : "text-muted-foreground hover:bg-[rgba(168,230,225,0.08)] hover:text-foreground",
                  )}
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-[rgba(168,230,225,0.1)] flex items-center justify-center">
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Music className="w-3 h-3 text-miku-primary/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium truncate leading-tight">
                      {song.title}
                    </p>
                    <p className="text-[10px] truncate opacity-60">
                      {song.artist}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono shrink-0 opacity-50">
                    {formatTime(song.duration)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
