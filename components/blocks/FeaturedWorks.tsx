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
}

interface FeaturedWorksProps {
  works: Work[];
}

export default function FeaturedWorks({ works }: FeaturedWorksProps) {
  const displayWorks = works.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-[24px] p-6 backdrop-blur-xl",
        "bg-[rgba(255,255,255,0.65)] border border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">精选作品</h2>
        <Link
          href="/works"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-miku-primary transition-colors"
        >
          查看全部
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {displayWorks.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link
              href={`/works/${work.slug}`}
              className={cn(
                "flex items-center gap-4 py-4 group",
                index !== displayWorks.length - 1 &&
                  "border-b border-[rgba(168,230,225,0.1)]"
              )}
            >
              {/* Thumbnail */}
              <div className="w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0">
                {work.coverUrl ? (
                  <Image
                    src={work.coverUrl}
                    alt={work.title}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-miku-primary to-miku-primary-light flex items-center justify-center text-lg">
                    🚀
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground truncate group-hover:text-miku-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {work.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
