"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LyricLineData {
  time: number;
  text: string;
}

interface LyricBarProps {
  /** Lyrics from the current song (timed) */
  lyrics?: LyricLineData[];
  /** Current audio playback time in seconds (fallback only) */
  currentTime?: number;
  /** Whether audio is currently playing */
  isPlaying?: boolean;
}

// Fallback static lyrics when no song lyrics are available
const FALLBACK_LYRICS = [
  "世界で一番おひめさま",
  "そういう扱い 心得てよね",
  "その一 いつもと違う髪形に気がつくこと",
  "その二 ちゃんと靴まで見ること いいね？",
];

const TYPING_SPEED = 60;
const DISPLAY_DURATION = 4000;
const CURSOR_BLINK_INTERVAL = 530;

/**
 * Find the current lyric line index for a given playback time.
 * Binary search for efficiency with large lyric arrays.
 */
function findLyricIndex(lyrics: LyricLineData[], time: number): number {
  let lo = 0;
  let hi = lyrics.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (lyrics[mid].time <= time) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

export default function LyricBar({
  lyrics = [],
  currentTime: propTime = 0,
  isPlaying = false,
}: LyricBarProps) {
  const hasTimedLyrics = lyrics.length > 0 && lyrics.some((l) => l.time > 0);

  // ---- Timed lyrics mode: derive current line directly from playback time ----
  const timedIndex = hasTimedLyrics ? findLyricIndex(lyrics, propTime) : -1;

  const currentTimedLine = timedIndex >= 0 ? lyrics[timedIndex] : null;

  // ---- Fallback mode: typing animation ----
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const currentFallback = FALLBACK_LYRICS[currentIndex];

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, CURSOR_BLINK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Typing effect (only in fallback mode)
  useEffect(() => {
    if (hasTimedLyrics) return;
    if (isExiting) return;

    if (displayedChars < currentFallback.length) {
      const timer = setTimeout(() => {
        setDisplayedChars((prev) => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [displayedChars, currentFallback, isExiting, hasTimedLyrics]);

  const handleExitComplete = useCallback(() => {
    if (isExiting && !hasTimedLyrics) {
      setCurrentIndex((prev) => (prev + 1) % FALLBACK_LYRICS.length);
      setDisplayedChars(0);
      setIsExiting(false);
    }
  }, [isExiting, hasTimedLyrics]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.div
        animate={isPlaying ? { scale: [1, 1.003, 1] } : { scale: 1 }}
        transition={
          isPlaying ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}
        }
        className={cn(
          "relative w-full rounded-2xl px-10 py-3.5",
          "backdrop-blur-xl border transition-[background-color,border-color,box-shadow] duration-500",
          "bg-[rgba(255,255,255,0.55)]",
          isPlaying
            ? "border-miku-primary/50 shadow-[0_0_16px_rgba(168,230,225,0.25)]"
            : "border-[rgba(168,230,225,0.40)]",
          "dark:bg-[rgba(0,0,0,0.35)]",
          isPlaying
            ? "dark:border-miku-primary/30 dark:shadow-[0_0_16px_rgba(168,230,225,0.15)]"
            : "dark:border-[rgba(255,255,255,0.12)]",
        )}
      >
        <div className="relative flex items-center justify-center min-h-6 gap-3">
          {/* Animated music icon when playing */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-end gap-0.75 h-4 shrink-0"
              aria-hidden="true"
            >
              <span
                className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.5s_ease-in-out_infinite]"
                style={{ height: "45%" }}
              />
              <span
                className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.12s]"
                style={{ height: "80%" }}
              />
              <span
                className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.24s]"
                style={{ height: "60%" }}
              />
              <span
                className="w-0.75 bg-miku-primary rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.36s]"
                style={{ height: "35%" }}
              />
            </motion.div>
          )}

          {hasTimedLyrics ? (
            /* Timed lyrics mode — new lyric enters immediately, old exits behind */
            <AnimatePresence mode="popLayout">
              <motion.div
                key={timedIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -6,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-center w-full"
              >
                <span className="text-[15px] font-semibold text-miku-primary">
                  {currentTimedLine ? currentTimedLine.text : "♪"}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Fallback typing animation mode */
            <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[15px] text-center font-semibold"
              >
                <span className="text-miku-primary">
                  {currentFallback.slice(0, displayedChars)}
                </span>
                <span
                  className={cn(
                    "inline-block w-[1ch] text-miku-primary transition-opacity duration-100",
                    cursorVisible ? "opacity-100" : "opacity-0",
                  )}
                >
                  |
                </span>
                <span className="text-muted-foreground">
                  {currentFallback.slice(displayedChars)}
                </span>
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
