"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
  repoUrl?: string | null;
}

interface FeaturedWorksProps {
  works: Work[];
}

export default function FeaturedWorks({ works }: FeaturedWorksProps) {
  if (works.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-[24px] p-6 backdrop-blur-xl",
        "bg-[rgba(255,255,255,0.9)] border border-[rgba(168,230,225,0.3)]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "dark:bg-dark-border dark:border-[rgba(255,255,255,0.12)]",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">精选作品</h2>
        <Link
          href="/works"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-miku-primary transition-colors"
        >
          查看全部
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List — no placeholders, shrinks to content */}
      <div className="flex flex-col">
        {works.slice(0, 4).map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <a
              href={work.repoUrl || "#"}
              target={work.repoUrl ? "_blank" : undefined}
              rel={work.repoUrl ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-4 py-2.5 group",
                index < Math.min(works.length, 4) - 1 &&
                  "border-b border-[rgba(168,230,225,0.1)]",
              )}
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                {work.coverUrl ? (
                  <Image
                    src={work.coverUrl}
                    alt={work.title}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-base">
                    🚀
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-miku-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {work.description}
                </p>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
