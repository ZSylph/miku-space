"use client";

import { motion } from "framer-motion";

interface Interest {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InterestGridProps {
  interests: Interest[];
}

const iconMap: Record<string, string> = {
  Code: "💻",
  Palette: "🎨",
  BookOpen: "📚",
  Camera: "📷",
};

// 颜色标识符 → Tailwind 类名（字面量供 JIT 扫描）
const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
};

export default function InterestGrid({ interests }: InterestGridProps) {
  return (
    <section className="container py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold mb-8 text-center"
      >
        正在做的事
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl p-6 ${colorMap[interest.color] || interest.color} hover:scale-105 transition-transform cursor-default`}
          >
            <div className="text-3xl mb-3">{iconMap[interest.icon] || "✨"}</div>
            <h3 className="font-semibold text-lg mb-1">{interest.title}</h3>
            <p className="text-sm opacity-80">{interest.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
