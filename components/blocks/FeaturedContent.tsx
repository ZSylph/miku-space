"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";

interface FeaturedPost {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string | null;
  createdAt: Date | string;
}

interface FeaturedContentProps {
  posts: FeaturedPost[];
}

function formatDate(d: Date | string): string {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function FeaturedContent({ posts }: FeaturedContentProps) {
  const [current, setCurrent] = useState(0);

  const handleShuffle = useCallback(() => {
    if (posts.length <= 1) return;
    setCurrent((prev) => {
      let next: number;
      do {
        next = Math.floor(Math.random() * posts.length);
      } while (next === prev && posts.length > 1);
      return next;
    });
  }, [posts.length]);

  if (!posts.length) return null;

  const post = posts[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] overflow-hidden backdrop-blur-xl border
        bg-light-card border-light-border
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        dark:bg-dark-card dark:border-dark-border
        dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-lg font-semibold">精选内容</h3>
        {posts.length > 1 && (
          <button
            onClick={handleShuffle}
            className="p-2 rounded-full transition-colors duration-200
              hover:bg-light-border text-muted-foreground hover:text-foreground
              dark:hover:bg-dark-border"
            aria-label="随机切换"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card with embedded title */}
      <div className="px-5 pb-5 flex-1 flex flex-col">
        <Link href={`/posts/${post.slug}`} className="flex flex-1 flex-col">
          <div className="relative w-full rounded-2xl overflow-hidden flex-1 min-h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {post.coverUrl ? (
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-miku-primary/20 to-miku-primary-light/30 flex items-center justify-center">
                    <span className="text-5xl select-none opacity-30">📝</span>
                  </div>
                )}
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Embedded title overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-miku-primary/80 rounded-md px-2 py-0.5">
                  精选文章
                </span>
                <span className="text-[11px] text-white/60">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.h4
                  key={post.id + "title"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-bold text-white leading-snug line-clamp-2"
                >
                  {post.title}
                </motion.h4>
              </AnimatePresence>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
