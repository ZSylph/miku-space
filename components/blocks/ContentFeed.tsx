"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  createdAt: Date;
  type: "post" | "note";
}

interface ContentFeedProps {
  items: ContentItem[];
}

export default function ContentFeed({ items }: ContentFeedProps) {
  return (
    <section className="container py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold mb-8"
      >
        最新内容
      </motion.h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/${item.type === "post" ? "posts" : "notes"}/${item.slug}`}
              className="block rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
                  {item.type === "post" ? "文章" : "笔记"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              {item.excerpt && (
                <p className="text-sm text-muted-foreground mt-1">{item.excerpt}</p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
