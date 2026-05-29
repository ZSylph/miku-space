"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const lyrics = [
  "世界で一番おひめさま",
  "そういう扱い 心得てよね",
  "その一 いつもと違う髪形に気がつくこと",
  "その二 ちゃんと靴まで見ること いいね？",
];

const TYPING_SPEED = 60; // ms per character
const DISPLAY_DURATION = 4000; // ms to show full lyric before switching
const CURSOR_BLINK_INTERVAL = 530; // ms

export default function LyricBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const currentLyric = lyrics[currentIndex];

  // Typing effect
  useEffect(() => {
    if (isExiting) return;

    if (displayedChars < currentLyric.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setDisplayedChars((prev) => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      // Wait for DISPLAY_DURATION then start exit
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [displayedChars, currentLyric, isExiting]);

  // Handle exit animation completion and switch to next lyric
  const handleExitComplete = useCallback(() => {
    if (isExiting) {
      setCurrentIndex((prev) => (prev + 1) % lyrics.length);
      setDisplayedChars(0);
      setIsTyping(true);
      setIsExiting(false);
    }
  }, [isExiting]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, CURSOR_BLINK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const visibleText = currentLyric.slice(0, displayedChars);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex justify-center px-4"
    >
      <div
        className={cn(
          "relative max-w-3xl w-full mx-auto rounded-full px-10 py-4",
          "border backdrop-blur-md",
          "bg-[rgba(168,230,225,0.08)] border-[rgba(168,230,225,0.2)]",
          "dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.1)]"
        )}
      >
        <div className="flex items-center justify-center min-h-[1.5rem]">
          <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-base text-center"
            >
              <span className="text-miku-primary">{visibleText}</span>
              <span
                className={cn(
                  "inline-block w-[1ch] text-miku-primary transition-opacity duration-100",
                  cursorVisible ? "opacity-100" : "opacity-0"
                )}
              >
                |
              </span>
              <span className="text-muted-foreground">
                {currentLyric.slice(displayedChars)}
              </span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
