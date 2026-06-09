"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Interest {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

interface InterestCarouselProps {
  interests: Interest[];
}

const AUTO_INTERVAL = 5000;

export default function InterestCarousel({ interests }: InterestCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play
  useEffect(() => {
    if (interests.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % interests.length);
    }, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interests.length, isPaused]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (index === current) return;
      setCurrent(index);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
      requestAnimationFrame(() => setIsPaused(false));
    },
    [current],
  );

  if (!interests.length) return null;

  const interest = interests[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative overflow-hidden rounded-[24px] backdrop-blur-xl border",
        "bg-light-card border-light-border",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "dark:bg-dark-card dark:border-dark-border",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
        "flex flex-col",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-lg font-semibold">正在做的事</h3>
      </div>

      {/* Slide area — background image with fade */}
      <div className="px-5 pb-5 flex-1 flex flex-col">
        <div className="relative w-full rounded-2xl overflow-hidden flex-1 min-h-42.5">
          <AnimatePresence mode="sync">
            <motion.div
              key={interest.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {interest.imageUrl ? (
                <Image
                  src={interest.imageUrl}
                  alt={interest.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-miku-primary/20 to-miku-primary-light/30" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

              {/* Text overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h4 className="text-sm font-bold text-white mb-1">
                  {interest.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                  {interest.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {interests.length > 1 && (
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
              {interests.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    index === current
                      ? "w-5 h-1.5 bg-white/90"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`切换到第 ${index + 1} 项`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
