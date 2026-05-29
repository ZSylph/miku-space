"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Mail,
  MessageCircle,
  MessageSquare,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  stats?: {
    posts: number;
    notes: number;
    works: number;
  };
}

const songs = [
  { id: "1", title: "World is Mine", artist: "ryo (supercell)", duration: 247 },
  { id: "2", title: "千本桜", artist: "黒うさP", duration: 212 },
  { id: "3", title: "深海少女", artist: "ゆうゆ", duration: 198 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const currentSong = songs[currentSongIndex];

  const handleNext = useCallback(() => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setCurrentTime(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const selectSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
      }
      const delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= currentSong.duration) {
          handleNext();
          return 0;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [isPlaying, currentSong.duration, handleNext]);

  const progressPercent = Math.min(
    (currentTime / currentSong.duration) * 100,
    100
  );

  const statItems = [
    { value: stats?.posts ?? 0, label: "文章" },
    { value: stats?.notes ?? 0, label: "笔记" },
    { value: stats?.works ?? 0, label: "作品" },
  ];

  const socials = [
    { icon: GitBranch, href: "https://github.com", label: "GitHub" },
    { icon: MessageSquare, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
    { icon: MessageCircle, href: "#", label: "Discord" },
  ];

  const glassCard = cn(
    "rounded-[24px] backdrop-blur-xl border",
    "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
    "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
  );

  return (
    <section className="container py-10 md:py-16">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Personal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(glassCard, "lg:flex-[1.2] p-7 flex flex-col gap-6")}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-2xl shadow-[0_2px_12px_rgba(168,230,225,0.3)]">
              <span className="text-white">🎵</span>
            </div>
            <div>
              <h1 className="text-[28px] font-bold tracking-tight bg-gradient-to-r from-miku-primary to-miku-primary-light bg-clip-text text-transparent">
                玖驻零时
              </h1>
              <p className="text-sm text-muted-foreground">
                设计师 / 开发者 / 二次元爱好者
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            这里是玖驻的个人空间，记录创作灵感、技术探索与生活点滴。喜欢初音未来，热爱设计与代码的交汇处。
          </p>

          <div className="flex gap-8">
            {statItems.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-base font-bold text-miku-primary">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  "bg-[rgba(168,230,225,0.12)] text-muted-foreground hover:text-miku-primary hover:bg-[rgba(168,230,225,0.2)]"
                )}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: Music Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className={cn(glassCard, "flex-1 p-6 flex flex-col gap-5")}
        >
          {/* Now playing header */}
          <div className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-miku-primary to-miku-primary-light flex items-center justify-center shrink-0">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1.5 rounded-full bg-[rgba(168,230,225,0.15)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-miku-primary to-miku-primary-light transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
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
              className="w-10 h-10 rounded-full bg-gradient-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-[#0D0D1A] shadow transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
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

          {/* Playlist */}
          <div className="flex flex-col gap-1">
            {songs.map((song, idx) => {
              const active = idx === currentSongIndex;
              return (
                <button
                  key={song.id}
                  onClick={() => selectSong(idx)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
                    active
                      ? "bg-[rgba(168,230,225,0.12)] text-miku-primary"
                      : "text-muted-foreground hover:bg-[rgba(168,230,225,0.06)] hover:text-foreground"
                  )}
                >
                  <span className="text-sm truncate pr-2">
                    {song.title}
                  </span>
                  <span className="text-xs font-mono shrink-0">
                    {formatTime(song.duration)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
