"use client";

import { useState, useCallback } from "react";
import PetalParticles from "@/components/effects/PetalParticles";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import HeroSection from "@/components/blocks/HeroSection";
import type { SongInfo } from "@/components/music/MusicProvider";
import type { LyricLine } from "@/lib/types";
import LyricBar from "@/components/blocks/LyricBar";
import InterestCarousel from "@/components/blocks/InterestCarousel";
import PersonalClock from "@/components/blocks/PersonalClock";
import FeaturedContent from "@/components/blocks/FeaturedContent";
import FeaturedWorks from "@/components/blocks/FeaturedWorks";
import LatestContent from "@/components/blocks/LatestContent";
import type { Interest, Work, Post, Note, Song } from "@prisma/client";

interface HomePageClientProps {
  interests: Interest[];
  works: Work[];
  posts: Post[];
  notes: Note[];
  featuredPosts: Post[];
  postCount: number;
  noteCount: number;
  workCount: number;
  songs: Song[];
}

function parseSongLyrics(song: Song): LyricLine[] {
  if (!song.lyrics) return [];
  try {
    return JSON.parse(song.lyrics) as LyricLine[];
  } catch {
    return [];
  }
}

export default function HomePageClient({
  interests,
  works,
  posts,
  notes,
  featuredPosts,
  postCount,
  noteCount,
  workCount,
  songs,
}: HomePageClientProps) {
  const contentItems = [
    ...posts.map((p) => ({ ...p, type: "post" as const })),
    ...notes.map((n) => ({ ...n, type: "note" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  // Track current playback for lyric sync
  const [currentLyrics, setCurrentLyrics] = useState<LyricLine[]>([]);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);

  // Pre-parse all song lyrics for fast lookup
  const songLyricsMap = useCallback(() => {
    const map = new Map<string, LyricLine[]>();
    for (const s of songs) {
      map.set(s.id, parseSongLyrics(s));
    }
    return map;
  }, [songs]);

  const lyricsMapRef = useState(songLyricsMap)[0];

  const handlePlaybackChange = useCallback(
    (info: { song: SongInfo | null; currentTime: number; isPlaying: boolean }) => {
      setCurrentPlaybackTime(info.currentTime);
      setIsCurrentlyPlaying(info.isPlaying);
      if (info.song) {
        const lyrics = lyricsMapRef.get(info.song.id) || [];
        setCurrentLyrics(lyrics);
      } else {
        setCurrentLyrics([]);
      }
    },
    [lyricsMapRef]
  );

  return (
    <>
      <PetalParticles />
      <FloatingOrbs />
      <div className="relative z-10 pb-6 md:pb-10 flex flex-col gap-5">
        <HeroSection
          stats={{ posts: postCount, notes: noteCount, works: workCount }}
          onPlaybackChange={handlePlaybackChange}
        />
        <LyricBar
          lyrics={currentLyrics}
          currentTime={currentPlaybackTime}
          isPlaying={isCurrentlyPlaying}
        />

        <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch">
          <div className="flex flex-col gap-4 lg:w-[36%]">
            <div>
              <InterestCarousel interests={interests} />
            </div>
            <div className="flex flex-col gap-4">
              <PersonalClock />
              <FeaturedContent posts={featuredPosts} />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:w-[64%]">
            <FeaturedWorks works={works} />
            <div className="flex-1 flex flex-col min-h-0">
              <LatestContent items={contentItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
