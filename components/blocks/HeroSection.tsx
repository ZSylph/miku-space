"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl">
          👋
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          你好，我是 <span className="text-primary">博主</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          这里是我的个人空间，记录学习、分享作品、表达想法。
        </p>
        <div className="flex gap-4">
          <Link
            href="/works"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            查看作品
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-input px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            了解更多
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
