"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// 2026 年节气表（简化版，覆盖全年）
const SOLAR_TERMS: { month: number; day: number; name: string }[] = [
  { month: 1, day: 5, name: "小寒" }, { month: 1, day: 20, name: "大寒" },
  { month: 2, day: 3, name: "立春" }, { month: 2, day: 18, name: "雨水" },
  { month: 3, day: 5, name: "惊蛰" }, { month: 3, day: 20, name: "春分" },
  { month: 4, day: 4, name: "清明" }, { month: 4, day: 20, name: "谷雨" },
  { month: 5, day: 5, name: "立夏" }, { month: 5, day: 21, name: "小满" },
  { month: 6, day: 5, name: "芒种" }, { month: 6, day: 21, name: "夏至" },
  { month: 7, day: 7, name: "小暑" }, { month: 7, day: 22, name: "大暑" },
  { month: 8, day: 7, name: "立秋" }, { month: 8, day: 23, name: "处暑" },
  { month: 9, day: 7, name: "白露" }, { month: 9, day: 23, name: "秋分" },
  { month: 10, day: 8, name: "寒露" }, { month: 10, day: 23, name: "霜降" },
  { month: 11, day: 7, name: "立冬" }, { month: 11, day: 22, name: "小雪" },
  { month: 12, day: 7, name: "大雪" }, { month: 12, day: 21, name: "冬至" },
];

const SITE_BIRTH = new Date("2026-01-01T00:00:00+08:00");
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getCurrentSolarTerm(month: number, day: number): string | null {
  // 找当前日期所在的节气（当天或上一个）
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    const t = SOLAR_TERMS[i];
    if (t.month < month || (t.month === month && t.day <= day)) {
      return t.name;
    }
  }
  return SOLAR_TERMS[SOLAR_TERMS.length - 1]?.name ?? null;
}

function getNextSolarTerm(year: number, month: number, day: number): { name: string; daysLeft: number } | null {
  const now = new Date(year, month - 1, day);
  for (const t of SOLAR_TERMS) {
    const tDate = new Date(year, t.month - 1, t.day);
    if (tDate > now) {
      const diff = Math.ceil((tDate.getTime() - now.getTime()) / 86400000);
      return { name: t.name, daysLeft: diff };
    }
  }
  // All terms passed this year — return first term of next year
  const firstTerm = SOLAR_TERMS[0];
  const nextYearDate = new Date(year + 1, firstTerm.month - 1, firstTerm.day);
  const diff = Math.ceil((nextYearDate.getTime() - now.getTime()) / 86400000);
  return { name: firstTerm.name, daysLeft: diff };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export default function PersonalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className={cn(
        "rounded-[24px] backdrop-blur-xl border p-7 h-full",
        "bg-[rgba(255,255,255,0.9)] border-[rgba(168,230,225,0.3)]",
        "dark:bg-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.12)]"
      )} />
    );
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = WEEKDAYS[now.getDay()];

  // Progress calculations
  const daySeconds = hours * 3600 + minutes * 60 + seconds;
  const dayProgress = (daySeconds / 86400) * 100;

  const dayOfYear = getDayOfYear(now);
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const yearDays = isLeap ? 366 : 365;
  const yearProgress = (dayOfYear / yearDays) * 100;

  // Site age
  const siteDays = Math.max(0, Math.floor((now.getTime() - SITE_BIRTH.getTime()) / 86400000));

  // Solar term
  const currentTerm = getCurrentSolarTerm(month, day);
  const nextTerm = getNextSolarTerm(year, month, day);

  // Circular progress
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (yearProgress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "rounded-[24px] backdrop-blur-xl border p-7 h-full flex flex-col",
        "bg-[rgba(255,255,255,0.9)] border-[rgba(168,230,225,0.3)]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "dark:bg-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.12)]",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
      )}
    >
      {/* Main time */}
      <div className="flex items-baseline justify-center gap-1.5 select-none">
        <span className="text-[52px] font-bold leading-none text-foreground tracking-tighter">
          {pad(hours)}:{pad(minutes)}
        </span>
        <span className="text-xl font-semibold text-miku-primary leading-none">
          {pad(seconds)}
        </span>
      </div>

      {/* Divider */}
      <div className="my-5 w-full border-t border-dashed border-[rgba(168,230,225,0.3)] dark:border-[rgba(255,255,255,0.1)]" />

      {/* Date row + year ring */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-base font-semibold text-foreground">
            {year}年{pad(month)}月{pad(day)}日
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{weekday}</span>
            {currentTerm && (
              <>
                <span className="text-[rgba(168,230,225,0.3)]">·</span>
                <span className="text-miku-primary font-medium">{currentTerm}</span>
              </>
            )}
          </div>
          {nextTerm && (
            <span className="text-xs text-muted-foreground/70">
              距 {nextTerm.name} 还有 {nextTerm.daysLeft} 天
            </span>
          )}
        </div>

        {/* Year progress ring */}
        <div className="relative shrink-0">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="rgba(168,230,225,0.15)"
              strokeWidth="4"
            />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="currentColor"
              className="text-miku-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
            {Math.round(yearProgress)}%
          </span>
        </div>
      </div>

      {/* Day progress bar */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>今日已过</span>
          <span>{Math.round(dayProgress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[rgba(168,230,225,0.15)] dark:bg-[rgba(255,255,255,0.08)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-miku-primary"
            initial={false}
            animate={{ width: `${dayProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Site age */}
      <div className="mt-auto pt-4 text-xs text-muted-foreground/60 text-center">
        本站已运行 {siteDays} 天
      </div>
    </motion.div>
  );
}
