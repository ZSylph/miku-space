"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimeInfo {
  hours: number;
  minutes: number;
  seconds: number;
  year: number;
  month: number;
  day: number;
  weekday: string;
  period: {
    icon: string;
    greeting: string;
  };
}

function getPeriod(hours: number): { icon: string; greeting: string } {
  if (hours >= 5 && hours < 12) {
    return { icon: "🌅", greeting: "早上好" };
  }
  if (hours >= 12 && hours < 18) {
    return { icon: "☀️", greeting: "下午好" };
  }
  return { icon: "🌙", greeting: "晚上好" };
}

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getTimeInfo(now: Date): TimeInfo {
  const hours = now.getHours();
  return {
    hours,
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: WEEKDAYS[now.getDay()],
    period: getPeriod(hours),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function PersonalClock() {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(() =>
    getTimeInfo(new Date())
  );

  useEffect(() => {
    const tick = () => {
      setTimeInfo(getTimeInfo(new Date()));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "rounded-[24px] backdrop-blur-xl border p-6",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      {/* Top: period greeting + icon */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg" aria-hidden="true">
          {timeInfo.period.icon}
        </span>
        <span className="text-sm font-medium text-foreground">
          {timeInfo.period.greeting}
        </span>
      </div>

      {/* Time: HH:MM:SS */}
      <div className="text-[32px] font-bold font-mono tracking-tight text-foreground mb-2">
        {pad(timeInfo.hours)}:{pad(timeInfo.minutes)}:{pad(timeInfo.seconds)}
      </div>

      {/* Date + weekday */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span className="text-sm">
          {timeInfo.year}年{timeInfo.month}月{timeInfo.day}日
        </span>
        <span className="text-xs opacity-50">|</span>
        <span className="text-xs">{timeInfo.weekday}</span>
      </div>
    </motion.div>
  );
}
