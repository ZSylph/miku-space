# 里程碑 3：首页 — 板块拼接 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页下方内容区重构为左右分栏的"板块拼接"布局：左栏放置兴趣轮播、个性化时钟、竖屏绘画；右栏放置精选作品纵向列表和最新内容 2×2 网格。所有板块使用统一毛玻璃卡片风格。

**Architecture:** 首页主体采用两栏布局（左 40% / 右 60%），每个板块是独立的毛玻璃卡片组件。兴趣轮播使用 Framer Motion AnimatePresence 实现滑动；时钟使用 setInterval 每秒更新；竖屏绘画使用竖向图片展示。右栏的精选作品和最新内容从现有组件重构为新的布局形式。

**Tech Stack:** Next.js 16, Tailwind CSS v4, TypeScript, Framer Motion, lucide-react

---

## 文件结构映射

| 文件 | 操作 | 职责 |
|------|------|------|
| `components/blocks/InterestCarousel.tsx` | 创建 | 兴趣轮播卡片（单卡片滑动 + 指示器） |
| `components/blocks/PersonalClock.tsx` | 创建 | 个性化时钟（时间 + 日期 + 时段图标） |
| `components/blocks/VerticalGallery.tsx` | 创建 | 竖屏绘画作品展示 |
| `components/blocks/FeaturedWorks.tsx` | 创建 | 精选作品纵向列表 |
| `components/blocks/LatestContent.tsx` | 创建 | 最新内容 2×2 网格 |
| `app/(site)/page.tsx` | 修改 | 整合新布局结构 |
| `components/blocks/InterestGrid.tsx` | 删除 | 被 InterestCarousel 替代 |
| `components/blocks/WorksPreview.tsx` | 删除 | 被 FeaturedWorks 替代 |
| `components/blocks/ContentFeed.tsx` | 删除 | 被 LatestContent 替代 |

---

## 已有的设计系统上下文

**颜色（Tailwind 自定义类）：**
- `miku-primary` (#A8E6E1), `miku-primary-light` (#C8F0EC), `miku-primary-dark` (#7DD9D2), `miku-pink` (#F5C6D0)
- `text-foreground`, `text-muted-foreground`
- `light-base` (#FFF5F7), `dark-base` (#0D0D1A)

**毛玻璃卡片样式（复用模式）：**
```tsx
className={cn(
  "rounded-3xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
)}
```

**入场动画（Framer Motion）：**
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, ease: "easeOut" }}
```

**当前 page.tsx 数据结构：**
```ts
const [interests, works, posts, notes] = await Promise.all([...]);
const contentItems = [...posts, ...notes].sort(...).slice(0, 5);
```

---

## Task 1：兴趣轮播卡片

**Files:**
- Create: `components/blocks/InterestCarousel.tsx`

**上下文：** 替换现有的 `InterestGrid`（4 列网格）为单卡片滑动轮播。数据来自 `prisma.interest`，每个兴趣有 title、description、icon、color 字段。

**设计规格：**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 单卡片展示：大图标（40px）+ 兴趣名称（20px font-bold）+ 简介（14px text-muted-foreground）
- 图标使用 lucide-react（不是 emoji），根据 interest.icon 字符串映射：Code→Code2, Palette→Palette, BookOpen→BookOpen, Camera→Camera
- 背景色：根据 interest.color 使用 colorMap（已有 `lib/colorMap.ts`）
- 底部指示器：小圆点，当前主题色 `bg-miku-primary`，其他 `bg-[rgba(168,230,225,0.2)]`
- 自动轮播：5 秒切换，手动点击指示器可跳转
- 切换动画：Framer Motion AnimatePresence，左右滑动（`x: 50 → 0 → -50`）

**接口：**
```tsx
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
```

- [ ] **Step 1：创建组件文件**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Palette, BookOpen, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorMap } from "@/lib/colorMap";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Code: Code2,
  Palette: Palette,
  BookOpen: BookOpen,
  Camera: Camera,
};

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

const AUTOPLAY_INTERVAL = 5000;

export default function InterestCarousel({ interests }: InterestCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return interests.length - 1;
      if (next >= interests.length) return 0;
      return next;
    });
  }, [interests.length]);

  useEffect(() => {
    if (interests.length <= 1) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [interests.length, paginate]);

  const current = interests[index];
  const Icon = iconMap[current.icon] || Code2;
  const bgColor = colorMap[current.color] || current.color;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section
      className={cn(
        "rounded-3xl backdrop-blur-xl border p-6 overflow-hidden",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">正在做的事</h2>
        <span className="text-xs text-muted-foreground">
          {index + 1} / {interests.length}
        </span>
      </div>

      <div className="relative min-h-[140px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "rounded-2xl p-5 flex flex-col items-center text-center",
              bgColor
            )}
          >
            <Icon className="h-10 w-10 mb-3" strokeWidth={1.5} />
            <h3 className="text-xl font-bold mb-1">{current.title}</h3>
            <p className="text-sm opacity-80">{current.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {interests.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index
                ? "w-6 bg-miku-primary"
                : "w-2 bg-[rgba(168,230,225,0.2)] hover:bg-[rgba(168,230,225,0.4)]"
            )}
            aria-label={`切换到第 ${i + 1} 项`}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/blocks/InterestCarousel.tsx
git commit -m "$(cat <<'EOF'
feat: add InterestCarousel with auto-play and slide animation

- Single-card carousel with Framer Motion AnimatePresence
- 5-second auto-play interval
- Dot indicators with active width expansion
- Lucide icons mapped from interest.icon field
- Color mapping from lib/colorMap
EOF
)"
```

---

## Task 2：个性化时钟

**Files:**
- Create: `components/blocks/PersonalClock.tsx`

**上下文：** 独立的毛玻璃卡片，显示当前时间、日期、星期和时段图标。使用 `setInterval` 每秒更新。

**设计规格：**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 时间：32px monospace font-bold，格式 `HH:MM:SS`
- 日期：14px text-muted-foreground，格式 `YYYY年M月D日`
- 星期：12px text-muted-foreground
- 时段图标：早上 🌅 / 下午 ☀️ / 晚上 🌙（根据当前小时）
- 入场动画：Framer Motion whileInView

- [ ] **Step 1：创建组件文件**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function getPeriodIcon(hour: number): string {
  if (hour >= 5 && hour < 12) return "🌅";
  if (hour >= 12 && hour < 18) return "☀️";
  return "🌙";
}

function getPeriodLabel(hour: number): string {
  if (hour >= 5 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 18) return "下午好";
  return "晚上好";
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default function PersonalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const icon = getPeriodIcon(hour);
  const label = getPeriodLabel(hour);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl backdrop-blur-xl border p-6",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{label}</h2>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="text-[32px] font-bold font-mono tracking-tight text-foreground">
        {formatTime(now)}
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <span>{formatDate(now)}</span>
        <span className="text-[rgba(168,230,225,0.3)]">|</span>
        <span>{weekdays[now.getDay()]}</span>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/blocks/PersonalClock.tsx
git commit -m "$(cat <<'EOF'
feat: add PersonalClock with live time and period icon

- Real-time clock updating every second
- Period-based greeting and icon (morning/afternoon/evening)
- Date and weekday display
- Monospace font for time digits
EOF
)"
```

---

## Task 3：竖屏绘画作品

**Files:**
- Create: `components/blocks/VerticalGallery.tsx`

**上下文：** 展示喜欢的插画/绘画作品。由于是"竖屏"展示，图片使用竖向比例。使用 mock 图片数据（public 目录下的图片），支持手动切换。

**设计规格：**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 顶部标题栏："喜欢的画" + 刷新/切换按钮（Shuffle icon）
- 图片区域：竖向比例（约 3:4），圆角 16px，高度约 200px
- 图片使用 Next.js Image 组件，object-fit: cover
- 切换按钮：点击随机切换到下一张
- 底部：图片标题（可选，mock 数据）
- 入场动画：Framer Motion whileInView

**Mock 数据：**
```ts
const paintings = [
  { src: "/paintings/1.jpg", title: "樱花树下" },
  { src: "/paintings/2.jpg", title: "星空列车" },
  { src: "/paintings/3.jpg", title: "雨后的街角" },
];
```

**注意：** 这些图片文件目前可能不存在。组件需要优雅处理图片缺失（使用占位渐变背景）。

- [ ] **Step 1：创建占位图片目录和组件**

先创建目录：
```bash
mkdir -p public/paintings
```

创建组件：
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

const paintings = [
  { src: "/paintings/1.jpg", title: "樱花树下", color: "from-miku-pink to-miku-primary-light" },
  { src: "/paintings/2.jpg", title: "星空列车", color: "from-miku-primary to-miku-primary-light" },
  { src: "/paintings/3.jpg", title: "雨后的街角", color: "from-miku-primary-light to-miku-pink" },
];

function getImageSrc(src: string): string {
  // In development, images may not exist. Return empty to trigger onError.
  return src;
}

export default function VerticalGallery() {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const current = paintings[index];

  const handleShuffle = () => {
    setImgError(false);
    setIndex((prev) => (prev + 1) % paintings.length);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl backdrop-blur-xl border p-6",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">喜欢的画</h2>
        <button
          onClick={handleShuffle}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
            "bg-[rgba(168,230,225,0.1)] text-muted-foreground",
            "hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary"
          )}
          aria-label="切换图片"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>

      <div className="relative h-[200px] rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {imgError ? (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  "bg-gradient-to-br",
                  current.color
                )}
              >
                <span className="text-white text-4xl opacity-60">🎨</span>
              </div>
            ) : (
              <Image
                src={getImageSrc(current.src)}
                alt={current.title}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-3 text-sm text-muted-foreground text-center">
        {current.title}
      </p>
    </motion.section>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
mkdir -p public/paintings
git add components/blocks/VerticalGallery.tsx public/paintings
git commit -m "$(cat <<'EOF'
feat: add VerticalGallery for portrait painting display

- Vertical aspect ratio image showcase
- Shuffle button to cycle through paintings
- Graceful fallback with gradient placeholder on missing images
- Framer Motion scale transition
EOF
)"
```

---

## Task 4：精选作品纵向列表

**Files:**
- Create: `components/blocks/FeaturedWorks.tsx`

**上下文：** 替换现有的 `WorksPreview`（2 列网格卡片）为纵向列表形式。每条横向卡片：左侧缩略图（60px 方形）+ 右侧标题/描述/标签。

**设计规格：**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 顶部标题栏："精选作品" + "查看全部 →" 链接（/works）
- 列表项：3-4 条（根据传入数据）
- 每条布局：flex row，左侧缩略图 60px 圆角 12px，右侧标题 + 描述
- 缩略图：coverUrl ? Image 组件 : 渐变占位
- 标题：16px font-semibold text-foreground，hover 变 miku-primary
- 描述：14px text-muted-foreground，单行截断
- 分隔线：项之间用 `border-b border-[rgba(168,230,225,0.1)]` 分隔
- 入场动画：Framer Motion whileInView，stagger 0.1s

**接口（同现有 WorksPreview）：**
```tsx
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
```

- [ ] **Step 1：创建组件文件**

```tsx
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
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl backdrop-blur-xl border p-6",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">精选作品</h2>
        <Link
          href="/works"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-miku-primary"
        >
          <span>查看全部</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-col">
        {works.slice(0, 4).map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/works/${work.slug}`}
              className={cn(
                "flex items-center gap-4 py-3 group",
                i !== works.length - 1 && "border-b border-[rgba(168,230,225,0.1)]"
              )}
            >
              {/* Thumbnail */}
              <div className="relative h-[60px] w-[60px] shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-miku-primary to-miku-primary-light">
                {work.coverUrl ? (
                  <Image
                    src={work.coverUrl}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg opacity-60">🚀</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground truncate group-hover:text-miku-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {work.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/blocks/FeaturedWorks.tsx
git commit -m "$(cat <<'EOF'
feat: add FeaturedWorks vertical list component

- Horizontal card layout with thumbnail + title/description
- View all link with arrow icon
- Staggered Framer Motion entrance
- Glassmorphism card container
EOF
)"
```

---

## Task 5：最新内容 2×2 网格

**Files:**
- Create: `components/blocks/LatestContent.tsx`

**上下文：** 替换现有的 `ContentFeed`（纵向列表）为 2×2 网格卡片。每张卡片显示类型标签、标题、日期。

**设计规格：**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 顶部标题栏："最新内容" + "更多 →" 链接（/posts）
- 网格：2 列，`grid-cols-2 gap-3`
- 每张卡片：
  - 类型标签："文章"或"笔记"，11px font-medium，圆角 pill
    - 文章：`bg-[rgba(168,230,225,0.15)] text-miku-primary-dark`
    - 笔记：`bg-[rgba(245,198,208,0.15)] text-miku-pink`
  - 标题：14px font-semibold，2 行截断 `line-clamp-2`
  - 日期：11px text-muted-foreground
  - 卡片背景：hover 时 `bg-[rgba(168,230,225,0.06)]`
  - 圆角：16px，padding 14px
- 最多显示 4 条（取前 4）
- 入场动画：Framer Motion whileInView，stagger 0.08s

**接口（同现有 ContentFeed）：**
```tsx
interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  createdAt: Date;
  type: "post" | "note";
}

interface LatestContentProps {
  items: ContentItem[];
}
```

- [ ] **Step 1：创建组件文件**

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  createdAt: Date;
  type: "post" | "note";
}

interface LatestContentProps {
  items: ContentItem[];
}

export default function LatestContent({ items }: LatestContentProps) {
  const displayed = items.slice(0, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl backdrop-blur-xl border p-6",
        "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
        "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">最新内容</h2>
        <Link
          href="/posts"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-miku-primary"
        >
          <span>更多</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={`/${item.type === "post" ? "posts" : "notes"}/${item.slug}`}
              className={cn(
                "block rounded-2xl p-3.5 transition-all duration-200",
                "bg-[rgba(168,230,225,0.04)] hover:bg-[rgba(168,230,225,0.08)]"
              )}
            >
              <span
                className={cn(
                  "inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2",
                  item.type === "post"
                    ? "bg-[rgba(168,230,225,0.15)] text-miku-primary-dark"
                    : "bg-[rgba(245,198,208,0.15)] text-miku-pink"
                )}
              >
                {item.type === "post" ? "文章" : "笔记"}
              </span>

              <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1.5">
                {item.title}
              </h3>

              <span className="text-[11px] text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/blocks/LatestContent.tsx
git commit -m "$(cat <<'EOF'
feat: add LatestContent 2x2 grid component

- 2-column grid layout for posts and notes
- Type badges with distinct colors (post=cyan, note=pink)
- Line-clamp title, short date format
- Hover background transition
- Staggered entrance animation
EOF
)"
```

---

## Task 6：整合新布局到首页

**Files:**
- Modify: `app/(site)/page.tsx`
- Delete: `components/blocks/InterestGrid.tsx`
- Delete: `components/blocks/WorksPreview.tsx`
- Delete: `components/blocks/ContentFeed.tsx`

**上下文：** 将首页下方从现有的三个独立 section（InterestGrid / WorksPreview / ContentFeed）重构为左右分栏的两栏布局。左栏堆叠 InterestCarousel + PersonalClock + VerticalGallery，右栏堆叠 FeaturedWorks + LatestContent。

**布局结构：**
```
<div className="relative z-10">
  <HeroSection />
  <LyricBar />
  
  {/* 两栏布局 */}
  <div className="flex flex-col lg:flex-row gap-5 py-6">
    {/* 左栏 ~40% */}
    <div className="flex flex-col gap-5 lg:w-[40%]">
      <InterestCarousel interests={interests} />
      <PersonalClock />
      <VerticalGallery />
    </div>
    
    {/* 右栏 ~60% */}
    <div className="flex flex-col gap-5 lg:w-[60%]">
      <FeaturedWorks works={works} />
      <LatestContent items={contentItems} />
    </div>
  </div>
</div>
```

**注意：**
- 删除旧组件文件：`InterestGrid.tsx`, `WorksPreview.tsx`, `ContentFeed.tsx`
- `page.tsx` 的 imports 需要更新
- 数据查询逻辑不变

- [ ] **Step 1：更新 page.tsx**

```tsx
import { prisma } from "@/lib/prisma";
import PetalParticles from "@/components/effects/PetalParticles";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import HeroSection from "@/components/blocks/HeroSection";
import LyricBar from "@/components/blocks/LyricBar";
import InterestCarousel from "@/components/blocks/InterestCarousel";
import PersonalClock from "@/components/blocks/PersonalClock";
import VerticalGallery from "@/components/blocks/VerticalGallery";
import FeaturedWorks from "@/components/blocks/FeaturedWorks";
import LatestContent from "@/components/blocks/LatestContent";

export default async function HomePage() {
  const [interests, works, posts, notes, postCount, noteCount, workCount] =
    await Promise.all([
      prisma.interest.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      prisma.work.findMany({
        where: { featured: true },
        orderBy: { order: "asc" },
        take: 4,
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.note.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.note.count({ where: { published: true } }),
      prisma.work.count({ where: { featured: true } }),
    ]);

  const contentItems = [
    ...posts.map((p) => ({ ...p, type: "post" as const })),
    ...notes.map((n) => ({ ...n, type: "note" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <PetalParticles />
      <FloatingOrbs />
      <div className="relative z-10">
        <HeroSection
          stats={{ posts: postCount, notes: noteCount, works: workCount }}
        />
        <LyricBar />

        <div className="flex flex-col lg:flex-row gap-5 py-6">
          <div className="flex flex-col gap-5 lg:w-[40%]">
            <InterestCarousel interests={interests} />
            <PersonalClock />
            <VerticalGallery />
          </div>

          <div className="flex flex-col gap-5 lg:w-[60%]">
            <FeaturedWorks works={works} />
            <LatestContent items={contentItems} />
          </div>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2：删除旧组件文件**

```bash
rm components/blocks/InterestGrid.tsx
rm components/blocks/WorksPreview.tsx
rm components/blocks/ContentFeed.tsx
```

- [ ] **Step 3：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：提交**

```bash
git add app/(site)/page.tsx
git rm components/blocks/InterestGrid.tsx components/blocks/WorksPreview.tsx components/blocks/ContentFeed.tsx
git commit -m "$(cat <<'EOF'
feat: integrate new tile layout into homepage

- Two-column layout: left 40% (carousel + clock + gallery), right 60% (works + content)
- Remove old InterestGrid, WorksPreview, ContentFeed
- Update page.tsx imports and layout structure
EOF
)"
```

---

## Task 7：里程碑 3 综合验证

- [ ] **Step 1：运行完整类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 2：运行开发服务器并全面检查**

Run: `npm run dev`
浏览器检查清单：
- [ ] 兴趣轮播：单卡片展示，5 秒自动切换，点击圆点可跳转，有滑动动画
- [ ] 时钟：实时更新时间，时段图标正确（🌅/☀️/🌙），日期和星期显示
- [ ] 竖屏绘画：竖向图片区域，点击 Shuffle 切换，缺失图片显示渐变占位
- [ ] 精选作品：纵向列表，缩略图 + 标题/描述，hover 变色，最多 4 条
- [ ] 最新内容：2×2 网格，类型标签颜色区分，标题 2 行截断
- [ ] 整体布局：桌面端左右分栏，移动端堆叠
- [ ] 所有板块：毛玻璃卡片风格统一
- [ ] 深浅色模式：所有板块适配正常
- [ ] 入场动画：滚动时有 stagger 动画效果

- [ ] **Step 3：最终提交**

```bash
git log --oneline -7
```
Expected: 看到 6-7 个里程碑 3 相关 commit

---

## 自我审查

### Spec 覆盖检查

| 设计文档要求 | 对应任务 |
|-------------|---------|
| 兴趣轮播卡片（单卡片 + 指示器 + 自动轮播）| Task 1 |
| 个性化时钟（时间 + 日期 + 时段图标）| Task 2 |
| 竖屏绘画作品（竖向展示 + 切换）| Task 3 |
| 精选作品纵向列表 | Task 4 |
| 最新内容 2×2 网格 | Task 5 |
| 左右分栏布局 | Task 6 |

### Placeholder 扫描

- [x] 无 "TBD"/"TODO"
- [x] 无模糊描述
- [x] 所有代码步骤有完整代码

### 类型一致性检查

- [x] `Work` / `ContentItem` 接口与 page.tsx 中使用的类型一致
- [x] `Interest` 接口与 prisma schema 返回类型一致
- [x] `colorMap` 引用自 `lib/colorMap.ts`（已存在）
- [x] 所有新组件均为 Client Component（"use client"）
