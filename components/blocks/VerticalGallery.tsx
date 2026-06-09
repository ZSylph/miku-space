"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";

interface Painting {
  src: string;
  title: string;
}

interface VerticalGalleryProps {
  paintings?: Painting[];
}

const defaultPaintings: Painting[] = [
  { src: "/paintings/1.jpg", title: "樱花树下" },
  { src: "/paintings/2.jpg", title: "星空列车" },
  { src: "/paintings/3.jpg", title: "雨后的街角" },
];

function ImageWithFallback({ src, title }: { src: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-linear-to-br from-miku-primary to-miku-primary-light flex items-center justify-center">
        <span className="text-4xl select-none" aria-hidden="true">
          🎨
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}

export default function VerticalGallery({
  paintings = defaultPaintings,
}: VerticalGalleryProps) {
  const [current, setCurrent] = useState(0);

  const handleShuffle = useCallback(() => {
    if (paintings.length <= 1) return;
    setCurrent((prev) => (prev + 1) % paintings.length);
  }, [paintings.length]);

  const currentPainting = paintings[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] p-6 backdrop-blur-xl border
        bg-[rgba(255,255,255,0.9)] border-[rgba(168,230,225,0.3)]
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        dark:bg-dark-border dark:border-[rgba(255,255,255,0.12)]
        dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">精选画集</h3>
        <button
          onClick={handleShuffle}
          disabled={paintings.length <= 1}
          className="p-2 rounded-full transition-colors duration-200
            hover:bg-[rgba(168,230,225,0.2)]
            dark:hover:bg-dark-border
            disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="切换下一张"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Image area */}
      <div className="relative w-full aspect-9/16 max-h-105 rounded-[16px] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPainting && (
            <motion.div
              key={currentPainting.src + current}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={currentPainting.src}
                title={currentPainting.title}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer title */}
      <AnimatePresence mode="wait">
        {currentPainting && (
          <motion.p
            key={currentPainting.title + current}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-3 text-sm text-center text-muted-foreground"
          >
            {currentPainting.title}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
