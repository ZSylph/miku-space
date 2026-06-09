"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface SongInfo {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string | null;
  duration: number;
}

interface MusicContextValue {
  songs: SongInfo[];
  currentSong: SongInfo | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (time: number) => void;
  playIndex: (index: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}

export default function MusicProvider({
  songs,
  children,
}: {
  songs: SongInfo[];
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentIndex] || null;

  // Create persistent audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (songs.length === 0) return;
      // Mark for auto-play when song ends naturally
      shouldAutoPlayRef.current = true;
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [songs.length]);

  // Update audio src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    const shouldPlay = shouldAutoPlayRef.current || isPlaying;
    shouldAutoPlayRef.current = false;
    audio.pause();
    audio.src = currentSong.audioUrl;
    audio.load();
    setCurrentTime(0);
    if (shouldPlay) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentSong?.id]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentSong]);

  const next = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  }, [songs.length]);

  const prev = useCallback(() => {
    if (songs.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const playIndex = useCallback((index: number) => {
    if (index < 0 || index >= songs.length) return;
    setCurrentIndex(index);
    // Audio src update + play handled by the currentIndex effect
    setTimeout(() => {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }, 50);
  }, [songs.length]);

  return (
    <MusicContext.Provider
      value={{
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
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
