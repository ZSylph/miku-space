"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Palette, BookOpen, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorMap } from "@/lib/colorMap";

interface Interest {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InterestCarouselProps {
  interests: Interest[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code: Code2,
  Palette: Palette,
  BookOpen: BookOpen,
  Camera: Camera,
};

export default function InterestCarousel({ interests }: InterestCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => {
        const next = prev + newDirection;
        if (next < 0) return interests.length - 1;
        if (next >= interests.length) return 0;
        return next;
      });
    },
    [interests.length]
  );

  useEffect(() => {
    if (interests.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [interests.length, paginate]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const interest = interests[current];
  const IconComponent = interest ? iconMap[interest.icon] : null;
  const colorClasses = interest
    ? colorMap[interest.color] || interest.color
    : "";

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="relative min-h-[140px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={interest?.id}
              custom={direction}
              initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-col items-center text-center w-full"
            >
              {IconComponent && (
                <div
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
                    colorClasses
                  )}
                >
                  <IconComponent className="w-10 h-10" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{interest?.title}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {interest?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {interests.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {interests.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  index === current
                    ? "bg-miku-primary"
                    : "bg-[rgba(168,230,225,0.2)] hover:bg-[rgba(168,230,225,0.4)]"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
