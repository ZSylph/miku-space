"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
}

interface WorksPreviewProps {
  works: Work[];
}

export default function WorksPreview({ works }: WorksPreviewProps) {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold"
        >
          精选作品
        </motion.h2>
        <Link
          href="/works"
          className="text-sm font-medium text-primary hover:underline"
        >
          查看全部 →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/works/${work.slug}`}>
              <div className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="aspect-video rounded-lg bg-muted mb-4 relative flex items-center justify-center text-4xl">
                  {work.coverUrl ? (
                    <Image src={work.coverUrl} alt={work.title} fill className="object-cover rounded-lg" />
                  ) : (
                    "🚀"
                  )}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {work.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
