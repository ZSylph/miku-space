"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Music,
  Play,
  Pause,
  Rss,
  SkipBack,
  SkipForward,
  Disc3,
} from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { cn, formatTime } from "@/lib/utils";
import { useMusic, type SongInfo } from "@/components/music/MusicProvider";
import type { LyricLine } from "@/lib/types";

interface HeroSectionProps {
  stats?: {
    posts: number;
    notes: number;
    works: number;
  };
  onPlaybackChange?: (info: {
    song: SongInfo | null;
    currentTime: number;
    isPlaying: boolean;
    lyrics: LyricLine[];
  }) => void;
}

export default function HeroSection({
  stats,
  onPlaybackChange,
}: HeroSectionProps) {
  const {
    songs,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next: handleNext,
    prev: handlePrev,
    seekTo,
  } = useMusic();

  const progressRef = useRef<HTMLDivElement>(null);

  // Notify parent of playback changes (for LyricBar)
  useEffect(() => {
    if (onPlaybackChange && currentSong) {
      onPlaybackChange({
        song: currentSong,
        currentTime,
        isPlaying,
        lyrics: [],
      });
    }
  }, [currentTime, isPlaying, currentSong, onPlaybackChange]);

  // Seek via progress bar click/drag
  const isDraggingRef = useRef(false);

  const seekToPosition = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      if (!bar) return;
      const effectiveDuration = duration || currentSong?.duration || 1;
      const rect = bar.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      seekTo(percent * effectiveDuration);
    },
    [duration, currentSong, seekTo],
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) seekToPosition(e.clientX);
    },
    [seekToPosition],
  );

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDraggingRef.current) seekToPosition(e.clientX);
    }
    function handleMouseUp() {
      isDraggingRef.current = false;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [seekToPosition]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      seekToPosition(e.clientX);
    },
    [seekToPosition],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) seekToPosition(e.touches[0].clientX);
    },
    [seekToPosition],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) seekToPosition(e.touches[0].clientX);
    },
    [seekToPosition],
  );

  const effectiveDuration = duration || currentSong?.duration || 1;
  const progressPercent = Math.min(
    (currentTime / effectiveDuration) * 100,
    100,
  );

  const statItems = [
    { value: stats?.posts ?? 0, label: "文章" },
    { value: stats?.notes ?? 0, label: "笔记" },
    { value: stats?.works ?? 0, label: "作品" },
  ];

  const socials = [
    {
      label: "Bilibili",
      href: siteConfig.social.bilibili,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: siteConfig.social.github,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "QQ邮箱",
      href: `mailto:${siteConfig.social.email}`,
      icon: <Mail className="w-4.5 h-4.5" strokeWidth={2} />,
    },
    {
      label: "RSS",
      href: "/rss.xml",
      icon: <Rss className="w-4.5 h-4.5" strokeWidth={2} />,
    },
  ];

  const glassCard = cn(
    "rounded-[24px] backdrop-blur-xl border",
    "bg-[rgba(255,255,255,0.9)] border-[rgba(168,230,225,0.3)]",
    "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
    "dark:bg-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.12)]",
    "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
  );

  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch">
        {/* Left: Personal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            glassCard,
            "lg:flex-3 p-6 flex flex-col gap-4 justify-center",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-[0_2px_12px_rgba(168,230,225,0.3)]">
              <Image
                src="/zsxy.jpg"
                alt="头像"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-[24px] font-bold tracking-tight bg-linear-to-r from-miku-primary to-miku-primary-light bg-clip-text text-transparent">
                玖驻zsxy
              </h1>
              <p className="text-sm text-muted-foreground">
                设计师 / 开发者 / 二次元
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            这里是玖驻的个人空间，记录创作灵感、技术探索与生活点滴。喜欢探索新技术，热爱设计与代码的交汇处。近期在学习AI全栈开发。
          </p>

          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              {statItems.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-[20px] font-bold text-miku-primary leading-none">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-px h-9 bg-[rgba(168,230,225,0.2)] dark:bg-dark-border" />

            <div className="flex gap-2.5">
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "group w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200",
                    "bg-[rgba(168,230,225,0.1)] text-muted-foreground",
                    "hover:text-miku-primary hover:bg-[rgba(168,230,225,0.28)]",
                  )}
                >
                  <span className="flex items-center justify-center w-6 h-6 transition-transform duration-200 group-hover:scale-[1.15]">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Music Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className={cn(
            glassCard,
            "lg:flex-2 p-6 flex flex-col justify-between",
          )}
        >
          {songs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Disc3 className="w-10 h-10 opacity-30" />
              <p className="text-sm">还没有歌曲</p>
              <p className="text-xs opacity-60">在后台管理中添加歌曲即可播放</p>
            </div>
          ) : (
            <>
              {/* Now playing — cover + info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[16px] bg-linear-to-br from-miku-primary to-miku-primary-light overflow-hidden shadow-[0_4px_16px_rgba(168,230,225,0.3)] shrink-0">
                  {currentSong?.coverUrl ? (
                    <Image
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music
                        className={cn(
                          "w-7 h-7 text-white",
                          isPlaying && "animate-pulse",
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-foreground truncate">
                    {currentSong?.title || "未选择歌曲"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {currentSong?.artist || ""}
                  </p>
                </div>
                {isPlaying && (
                  <div className="flex items-end gap-0.75 h-5 shrink-0">
                    <span
                      className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"
                      style={{ height: "50%" }}
                    />
                    <span
                      className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.15s]"
                      style={{ height: "100%" }}
                    />
                    <span
                      className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.3s]"
                      style={{ height: "35%" }}
                    />
                    <span
                      className="w-0.75 bg-miku-primary/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.1s]"
                      style={{ height: "70%" }}
                    />
                  </div>
                )}
              </div>

              {/* Waveform decoration */}
              <div className="flex items-center justify-center gap-0.5 h-8">
                {Array.from({ length: 32 }).map((_, i) => {
                  const baseHeight =
                    Math.sin(i * 0.45) * 8 + Math.sin(i * 1.2) * 4 + 6;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "w-0.75 rounded-full bg-miku-primary",
                        isPlaying ? "opacity-40" : "opacity-20",
                      )}
                      style={{
                        height: isPlaying
                          ? `${Math.max(4, baseHeight)}px`
                          : "4px",
                        transition: `height 0.4s ease ${(i % 8) * 0.05}s`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-1.5">
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  className="w-full h-3 rounded-full cursor-pointer group -my-0.75 py-0.75 select-none"
                >
                  <div className="w-full h-1.5 rounded-full bg-[rgba(168,230,225,0.15)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-miku-primary to-miku-primary-light transition-all duration-150 relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-miku-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(effectiveDuration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handlePrev}
                  aria-label="上一首"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "暂停" : "播放"}
                  className="w-13 h-13 rounded-full bg-linear-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-dark-base shadow-[0_4px_16px_rgba(168,230,225,0.35)] transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-5.5 h-5.5" />
                  ) : (
                    <Play className="w-5.5 h-5.5 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  aria-label="下一首"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
