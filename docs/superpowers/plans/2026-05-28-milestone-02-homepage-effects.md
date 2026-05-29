# 里程碑 2：首页 — 特效与 Hero — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现首页专属视觉特效（Canvas 花瓣粒子 + 浮动光斑）和全新 Hero 区域（个人卡片 + 音乐播放器 + 歌词条）。

**Architecture:** Canvas 粒子系统封装为独立 Client Component，通过 `useRef` + `useEffect` 管理生命周期和动画循环。Hero 区域使用左右分栏布局，左栏个人卡片、右栏音乐播放器。歌词条独立于 Hero，在 Hero 下方单行展示。所有组件均适配双模式（深浅色主题）。

**Tech Stack:** Next.js 16, Tailwind CSS v4, TypeScript, Framer Motion, Canvas 2D, HTML5 Audio

---

## 文件结构映射

| 文件 | 操作 | 职责 |
|------|------|------|
| `components/effects/PetalParticles.tsx` | 创建 | Canvas 花瓣飘落粒子系统（首页背景） |
| `components/effects/FloatingOrbs.tsx` | 创建 | 浮动光斑粒子（首页背景叠加） |
| `components/blocks/HeroSection.tsx` | 重写 | Hero 区域（个人卡片 + 音乐播放器） |
| `components/blocks/LyricBar.tsx` | 创建 | 歌词条组件（打字机光标效果） |
| `app/(site)/page.tsx` | 修改 | 整合新组件到首页 |

---

## 已有的设计系统上下文

以下已在里程碑 1 中完成，各任务直接复用：

**颜色（Tailwind 自定义类）：**
- `--color-miku-primary: #A8E6E1` — 主题色
- `--color-miku-primary-light: #C8F0EC` — 浅色主题
- `--color-miku-primary-dark: #7DD9D2` — 深色主题
- `--color-miku-pink: #F5C6D0` — 点缀粉
- `--color-light-base: #FFF5F7` — 浅色背景
- `--color-dark-base: #0D0D1A` — 深色背景
- `text-muted-foreground` — 辅助文字色
- `text-foreground` — 主文字色

**工具类（已存在于 `globals.css`）：**
- `.glass` — 深色毛玻璃
- `.glass-light` — 浅色毛玻璃
- `.text-gradient` — 渐变文字
- `.bg-gradient-miku` — 渐变背景

**字体：** Outfit (Google Fonts)，已加载于 `app/layout.tsx`

**布局：** `app/(site)/layout.tsx` 提供 `max-w-7xl` 容器、`bg-light-base dark:bg-dark-base`

**导航栏：** `components/layout/Navbar.tsx`，毛玻璃风格，`sticky top-5 z-50`

---

## Task 1：Canvas 花瓣粒子系统

**Files:**
- Create: `components/effects/PetalParticles.tsx`

**上下文：** 首页专属背景特效。使用 Canvas 2D 渲染花瓣形状粒子，从顶部飘落到底部，带左右摇摆和旋转效果。深色模式下花瓣更亮更明显，浅色模式下更 subtle。性能策略：requestAnimationFrame + delta time、document.hidden 时暂停、prefers-reduced-motion 时禁用。

**设计规格：**
- 花瓣双色：淡粉 `#F5C6D0`（60%）+ 淡青 `#A8E6E1`（40%）
- 数量：桌面 30-50 片（通过屏幕宽度自适应：桌面 45，平板 30，移动端 15）
- 形状：简化椭圆（长宽比 2:1），非 SVG path（保持性能）
- 运动：匀速下落 + 正弦波左右摇摆（振幅 20-40px，频率随机）+ 轻微旋转
- 大小：6-14px（随机）
- 速度：每帧 0.5-1.5px（随机）
- 透明度：深色模式 0.3-0.7，浅色模式 0.15-0.4
- 随页面滚动，粒子继续下落（不随滚动位置重置）

- [ ] **Step 1：创建花瓣粒子组件**

```tsx
"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  timeOffset: number;
}

function getParticleCount(): number {
  if (typeof window === "undefined") return 30;
  if (window.innerWidth < 640) return 15;
  if (window.innerWidth < 1024) return 30;
  return 45;
}

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function createPetal(canvasWidth: number): Petal {
  const dark = isDarkMode();
  const isPink = Math.random() < 0.6;
  return {
    x: Math.random() * canvasWidth,
    y: -20,
    size: 6 + Math.random() * 8,
    speedY: 0.5 + Math.random() * 1.0,
    speedX: (Math.random() - 0.5) * 0.3,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    opacity: dark ? 0.3 + Math.random() * 0.4 : 0.15 + Math.random() * 0.25,
    color: isPink ? "#F5C6D0" : "#A8E6E1",
    swayAmplitude: 20 + Math.random() * 20,
    swayFrequency: 0.001 + Math.random() * 0.002,
    timeOffset: Math.random() * 10000,
  };
}

export default function PetalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const petalsRef = useRef<Petal[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Initialize petals
    const count = getParticleCount();
    petalsRef.current = Array.from({ length: count }, () =>
      createPetal(window.innerWidth)
    );
    // Scatter initial positions vertically
    petalsRef.current.forEach((p) => {
      p.y = Math.random() * window.innerHeight;
    });

    function animate(timestamp: number) {
      if (document.hidden) {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = lastTimeRef.current
        ? Math.min((timestamp - lastTimeRef.current) / 16.67, 3)
        : 1;
      lastTimeRef.current = timestamp;

      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const dark = isDarkMode();

      petalsRef.current.forEach((petal) => {
        // Update position
        petal.y += petal.speedY * deltaTime;
        const elapsed = timestamp + petal.timeOffset;
        petal.x +=
          Math.sin(elapsed * petal.swayFrequency) * petal.swayAmplitude * 0.02 * deltaTime +
          petal.speedX * deltaTime;
        petal.rotation += petal.rotationSpeed * deltaTime;

        // Reset when out of bounds
        if (petal.y > canvasHeight + 20) {
          Object.assign(petal, createPetal(canvasWidth));
          petal.y = -20;
        }
        if (petal.x < -50) petal.x = canvasWidth + 50;
        if (petal.x > canvasWidth + 50) petal.x = -50;

        // Draw petal (ellipse)
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = petal.opacity * (dark ? 1 : 0.7);
        ctx.fillStyle = petal.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/effects/PetalParticles.tsx
git commit -m "$(cat <<'EOF'
feat: add Canvas petal particle system for homepage

- Ellipse-shaped petals in pink (60%) and cyan (40%)
- Sine-wave sway + rotation animation
- Responsive particle count (15/30/45)
- Dark/light mode opacity adaptation
- Reduced motion preference support
- Performance: requestAnimationFrame + delta time
EOF
)"
```

---

## Task 2：浮动光斑粒子

**Files:**
- Create: `components/effects/FloatingOrbs.tsx`

**上下文：** 首页背景叠加特效，在花瓣之上营造朦胧梦幻感。比花瓣更 subtle，使用 blur 光点缓慢漂浮。深色模式更明显，浅色模式更朦胧。

**设计规格：**
- 数量：18 个（不随屏幕变化）
- 形状：圆形，大小 2-8px
- 颜色：白色/淡青 `#A8E6E1`，深色模式更亮
- blur：4-12px（深色），6-16px（浅色）
- 运动：极慢速随机漂浮（速度 0.1-0.3px/帧）
- 透明度变化：呼吸效果（正弦波 0.2-0.6）
- 无旋转，仅平移 + 透明度呼吸

- [ ] **Step 1：创建光斑粒子组件**

```tsx
"use client";

import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  breatheSpeed: number;
  breatheOffset: number;
  color: string;
  blur: number;
}

const ORB_COUNT = 18;

function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function createOrb(canvasWidth: number, canvasHeight: number): Orb {
  const dark = isDarkMode();
  const isCyan = Math.random() < 0.5;
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: 2 + Math.random() * 6,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
    opacity: 0.2 + Math.random() * 0.3,
    baseOpacity: 0.2 + Math.random() * 0.3,
    breatheSpeed: 0.0005 + Math.random() * 0.001,
    breatheOffset: Math.random() * Math.PI * 2,
    color: isCyan ? "#A8E6E1" : "#FFFFFF",
    blur: dark ? 4 + Math.random() * 8 : 6 + Math.random() * 10,
  };
}

export default function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    orbsRef.current = Array.from({ length: ORB_COUNT }, () =>
      createOrb(window.innerWidth, window.innerHeight)
    );

    function animate(timestamp: number) {
      if (document.hidden) {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = lastTimeRef.current
        ? Math.min((timestamp - lastTimeRef.current) / 16.67, 3)
        : 1;
      lastTimeRef.current = timestamp;

      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      orbsRef.current.forEach((orb) => {
        // Update position
        orb.x += orb.speedX * deltaTime;
        orb.y += orb.speedY * deltaTime;

        // Wrap around edges
        if (orb.x < -20) orb.x = canvasWidth + 20;
        if (orb.x > canvasWidth + 20) orb.x = -20;
        if (orb.y < -20) orb.y = canvasHeight + 20;
        if (orb.y > canvasHeight + 20) orb.y = -20;

        // Breathe opacity
        const breathe =
          Math.sin(timestamp * orb.breatheSpeed + orb.breatheOffset) * 0.15;
        orb.opacity = Math.max(0.1, Math.min(0.6, orb.baseOpacity + breathe));

        // Draw orb with blur
        ctx.save();
        ctx.globalAlpha = orb.opacity;
        ctx.filter = `blur(${orb.blur}px)`;
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/effects/FloatingOrbs.tsx
git commit -m "$(cat <<'EOF'
feat: add floating orb particles for homepage

- 18 soft blur orbs floating slowly
- Breathing opacity animation
- White and cyan color mix
- Dark/light mode blur adaptation
- Reduced motion support
EOF
)"
```

---

## Task 3：Hero 区域重构（个人卡片 + 音乐播放器）

**Files:**
- Rewrite: `components/blocks/HeroSection.tsx`

**上下文：** 当前 Hero 区域为居中单栏（头像 + 标题 + 简介 + 按钮），需要改为左右分栏布局。左栏为个人卡片，右栏为音乐播放器。整体设计保持毛玻璃卡片风格，适配深浅色双模式。

**当前数据结构（来自 page.tsx）：**
- 需要传入：用户统计数字（文章数、笔记数、作品数）、社交链接
- 音乐播放器需要：歌曲列表（mock 数据即可）、播放控制

**设计规格：**

**左栏（约 55% 宽度）：个人卡片**
- 外层：毛玻璃卡片 `.glass-light dark:glass`，圆角 24px，padding 28px
- 头像区域：64px 圆角 16px 方块，渐变背景 `from-miku-primary to-miku-primary-light`
- 用户名：28px font-bold tracking-tight，文字渐变 `text-gradient`
- 简介：14px text-muted-foreground，max-w-md
- 统计行：三列数字 + 标签，数字用 `text-miku-primary` 色，16px font-bold
- 社交图标行：GitHub / Twitter / Email / Discord，使用 lucide-react 图标，32px 圆角按钮，半透明底 + hover 主题色

**右栏（约 45% 宽度）：音乐播放器**
- 外层：毛玻璃卡片，圆角 24px，padding 24px
- 专辑封面：52px 圆角 14px，渐变背景占位
- 歌曲信息：歌名（16px font-semibold）+ 歌手（12px text-muted-foreground）
- 进度条：渐变填充 `from-miku-primary to-miku-primary-light`，背景 rgba 轨道
- 时间：当前时间 / 总时间，12px monospace
- 控制按钮：上一首 / 播放暂停（40px 渐变圆形）/ 下一首，使用 lucide-react SkipBack / Play / Pause / SkipForward
- 歌曲列表：最多 3 首，当前播放高亮，hover 主题色

**布局：** 桌面端 flex-row 左右分栏，移动端 flex-col 堆叠。两栏间距 20px。

**动画：** 入场 Framer Motion，初始 `opacity: 0, y: 20`，animate `opacity: 1, y: 0`，duration 0.6s，ease-out。左栏先出现，右栏 delay 0.15s。

- [ ] **Step 1：重写 HeroSection 组件**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Mail,
  MessageCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock song data
const songs = [
  { id: "1", title: "World is Mine", artist: "ryo (supercell)", duration: 247 },
  { id: "2", title: "千本桜", artist: "黒うさP", duration: 212 },
  { id: "3", title: "深海少女", artist: "ゆうゆ", duration: 198 },
];

interface HeroSectionProps {
  stats?: {
    posts: number;
    notes: number;
    works: number;
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const progressRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const currentSong = songs[currentSongIndex];

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    function update(timestamp: number) {
      if (lastTimeRef.current) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        progressRef.current += delta;
        if (progressRef.current >= currentSong.duration) {
          progressRef.current = 0;
          setCurrentSongIndex((i) => (i + 1) % songs.length);
        }
        setCurrentTime(progressRef.current);
      }
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(update);
    }

    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, currentSongIndex, currentSong.duration]);

  // Reset progress when song changes
  useEffect(() => {
    progressRef.current = 0;
    setCurrentTime(0);
  }, [currentSongIndex]);

  const progressPercent = (currentTime / currentSong.duration) * 100;

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handlePrev = () => {
    setCurrentSongIndex((i) => (i - 1 + songs.length) % songs.length);
  };
  const handleNext = () => {
    setCurrentSongIndex((i) => (i + 1) % songs.length);
  };

  const statItems = [
    { label: "文章", value: stats?.posts ?? 0 },
    { label: "笔记", value: stats?.notes ?? 0 },
    { label: "作品", value: stats?.works ?? 0 },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
    { icon: MessageCircle, href: "#", label: "Discord" },
  ];

  return (
    <section className="relative z-10 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "flex-1 lg:flex-[1.2] rounded-3xl p-7",
            "glass-light dark:glass"
          )}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_12px_rgba(168,230,225,0.3)]">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-gradient">
                玖驻零时
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                设计师 / 开发者 / 二次元爱好者
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
            这里是玖驻的个人空间，记录创作灵感、技术探索与生活点滴。喜欢初音未来，热爱设计与代码的交汇处。
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6">
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-base font-bold text-miku-primary">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                  "bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground",
                  "hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark hover:-translate-y-0.5"
                )}
              >
                <social.icon className="h-4 w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: Music Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className={cn(
            "flex-1 rounded-3xl p-6",
            "glass-light dark:glass"
          )}
        >
          {/* Current Song Info */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_10px_rgba(168,230,225,0.25)]">
              <Music className="h-5 w-5 text-[#0D0D1A]" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold truncate text-foreground">
                {currentSong.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1.5 w-full rounded-full bg-[rgba(168,230,225,0.15)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-miku-primary to-miku-primary-light transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-muted-foreground font-mono">
                {formatTime(currentTime)}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {formatTime(currentSong.duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-miku-primary"
              aria-label="上一首"
            >
              <SkipBack className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={handlePlayPause}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                "bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_12px_rgba(168,230,225,0.3)]",
                "hover:shadow-[0_4px_20px_rgba(168,230,225,0.4)] hover:scale-105 active:scale-95"
              )}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-[#0D0D1A]" strokeWidth={2.5} />
              ) : (
                <Play className="h-4 w-4 text-[#0D0D1A] ml-0.5" strokeWidth={2.5} />
              )}
            </button>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-miku-primary"
              aria-label="下一首"
            >
              <SkipForward className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Song List */}
          <div className="space-y-1">
            {songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setIsPlaying(true);
                }}
                className={cn(
                  "flex items-center justify-between w-full rounded-xl px-3 py-2 text-left transition-all duration-200",
                  index === currentSongIndex
                    ? "bg-[rgba(168,230,225,0.12)] text-miku-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.06)]"
                )}
              >
                <span className="text-sm truncate pr-2">{song.title}</span>
                <span className="text-[11px] shrink-0 font-mono opacity-70">
                  {formatTime(song.duration)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2：更新 page.tsx 传入 stats 数据**

修改 `app/(site)/page.tsx`，在 prisma 查询中添加统计数量：

```tsx
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
// ... other imports

export default async function HomePage() {
  const [interests, works, posts, notes, postCount, noteCount, workCount] = await Promise.all([
    prisma.interest.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.work.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.note.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.post.count({ where: { published: true } }),
    prisma.note.count({ where: { published: true } }),
    prisma.work.count({ where: { featured: true } }),
  ]);

  // ... existing contentItems logic

  return (
    <div className="relative">
      <HeroSection stats={{ posts: postCount, notes: noteCount, works: workCount }} />
      {/* ... other sections */}
    </div>
  );
}
```

**注意：** 只添加 stats 参数，保留其他 section 不变。

- [ ] **Step 3：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：提交**

```bash
git add components/blocks/HeroSection.tsx app/(site)/page.tsx
git commit -m "$(cat <<'EOF'
feat: redesign Hero section with profile card and music player

- Left column: profile card with avatar, name gradient, stats, social links
- Right column: music player with progress bar, controls, song list
- Framer Motion entrance animation with stagger
- Glassmorphism card styling (light/dark adaptive)
- Mock song data with simulated playback progress
EOF
)"
```

---

## Task 4：歌词条组件

**Files:**
- Create: `components/blocks/LyricBar.tsx`

**上下文：** 位于 Hero 区域下方，单行居中显示歌词。当前歌词白色高亮，待播放歌词灰色。带有打字机闪烁光标效果。毛玻璃背景条。

**设计规格：**
- 容器：圆角 pill 形状（rounded-full），max-w-2xl 居中，padding 14px 28px
- 背景：`bg-[rgba(168,230,225,0.08)]` 浅色，`dark:bg-[rgba(255,255,255,0.05)]` 深色
- 边框：`border-[rgba(168,230,225,0.2)]` 浅色，`dark:border-[rgba(255,255,255,0.1)]` 深色
- 文字：14px，居中
- 歌词状态：当前词 `text-miku-primary`，已播放 `text-muted-foreground opacity-50`，未播放 `text-muted-foreground opacity-30`
- 打字机光标：`|` 字符，闪烁动画（opacity 0→1→0，1.2s 循环），当前词结束后显示
- 支持逐字高亮效果（当前词逐字变亮）

**动画：**
- 入场：Framer Motion，`opacity: 0, y: 10` → `opacity: 1, y: 0`，delay 0.3s
- 光标闪烁：CSS animation

**Mock 歌词数据：**
```ts
const lyrics = [
  "世界で一番おひめさま",
  "そういう扱い 心得てよね",
  "その一 いつもと違う髪形に気がつくこと",
  "その二 ちゃんと靴まで見ること いいね？",
];
```
- 自动轮播，每句 4 秒，循环播放
- 切换时淡入淡出

- [ ] **Step 1：创建歌词条组件**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const lyrics = [
  "世界で一番おひめさま",
  "そういう扱い 心得てよね",
  "その一 いつもと違う髪形に気がつくこと",
  "その二 ちゃんと靴まで見ること いいね？",
];

const LYRIC_DURATION = 4000; // ms per lyric

export default function LyricBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const currentLyric = lyrics[currentIndex];

  // Typewriter effect
  useEffect(() => {
    setCharIndex(0);
    setDisplayText("");
    setShowCursor(true);

    const interval = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= currentLyric.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [currentIndex, currentLyric]);

  // Update display text
  useEffect(() => {
    setDisplayText(currentLyric.slice(0, charIndex));
  }, [charIndex, currentLyric]);

  // Cycle through lyrics
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lyrics.length);
    }, LYRIC_DURATION);

    return () => clearInterval(timer);
  }, []);

  // Cursor blink after typing complete
  useEffect(() => {
    if (charIndex >= currentLyric.length) {
      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 600);
      return () => clearInterval(blinkInterval);
    }
  }, [charIndex, currentLyric.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      className="relative z-10 flex justify-center py-4"
    >
      <div
        className={cn(
          "flex items-center justify-center max-w-2xl w-full mx-auto",
          "rounded-full px-7 py-3.5",
          "bg-[rgba(168,230,225,0.08)] border border-[rgba(168,230,225,0.2)]",
          "dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.1)]"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <span className="text-sm text-muted-foreground">
              <span className="text-miku-primary">{displayText}</span>
              {charIndex < currentLyric.length && (
                <span
                  className={cn(
                    "text-miku-primary transition-opacity duration-100",
                    showCursor ? "opacity-100" : "opacity-0"
                  )}
                >
                  |
                </span>
              )}
              {charIndex >= currentLyric.length && (
                <span
                  className={cn(
                    "text-miku-primary transition-opacity duration-300",
                    showCursor ? "opacity-100" : "opacity-0"
                  )}
                >
                  |
                </span>
              )}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2：更新 page.tsx 添加歌词条**

修改 `app/(site)/page.tsx`，在 `HeroSection` 后添加 `LyricBar`：

```tsx
import HeroSection from "@/components/blocks/HeroSection";
import LyricBar from "@/components/blocks/LyricBar";
// ... other imports

export default async function HomePage() {
  // ... existing queries

  return (
    <div className="relative">
      <HeroSection stats={{ posts: postCount, notes: noteCount, works: workCount }} />
      <LyricBar />
      {/* ... existing sections */}
    </div>
  );
}
```

- [ ] **Step 3：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：提交**

```bash
git add components/blocks/LyricBar.tsx app/(site)/page.tsx
git commit -m "$(cat <<'EOF'
feat: add lyric bar with typewriter effect

- Pill-shaped glassmorphism container
- Typewriter text reveal animation
- Blinking cursor effect
- Auto-cycling through mock lyrics
- Framer Motion enter animation
EOF
)"
```

---

## Task 5：整合粒子特效到首页

**Files:**
- Modify: `app/(site)/page.tsx`

**上下文：** 将 PetalParticles 和 FloatingOrbs 添加到首页，确保它们只在此页面渲染。Canvas 组件使用 `position: fixed` 覆盖全屏，pointer-events: none，z-index 底层。

**注意：** 粒子组件需要在内容 z-index 之下。当前 layout 中 main 有默认 z-index，需要确认粒子不会被遮挡。给 page.tsx 的容器添加 `relative z-10` 确保内容在粒子上方。

- [ ] **Step 1：更新 page.tsx 导入并放置粒子组件**

将 `app/(site)/page.tsx` 完整替换为：

```tsx
import { prisma } from "@/lib/prisma";
import PetalParticles from "@/components/effects/PetalParticles";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import HeroSection from "@/components/blocks/HeroSection";
import LyricBar from "@/components/blocks/LyricBar";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";
import ContentFeed from "@/components/blocks/ContentFeed";

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
        <InterestGrid interests={interests} />
        <WorksPreview works={works} />
        <ContentFeed items={contentItems} />
      </div>
    </>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：运行开发服务器验证效果**

Run: `npm run dev`
浏览器检查清单：
- [ ] 花瓣粒子从顶部飘落，有摇摆效果
- [ ] 光斑粒子缓慢漂浮，有呼吸效果
- [ ] 内容在粒子上方正常显示
- [ ] 深浅色切换时粒子透明度和 blur 变化
- [ ] 切换到其他页面时粒子消失（不在 layout 中挂载）

- [ ] **Step 4：提交**

```bash
git add app/(site)/page.tsx
git commit -m "$(cat <<'EOF'
feat: integrate particle effects into homepage

- Add PetalParticles and FloatingOrbs to homepage only
- Wrap content in relative z-10 container
- Pass stats to HeroSection
- Include LyricBar below Hero
EOF
)"
```

---

## Task 6：里程碑 2 综合验证

- [ ] **Step 1：运行完整类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 2：运行开发服务器并全面检查**

Run: `npm run dev`
浏览器检查清单：
- [ ] 花瓣粒子：深色模式明显，浅色模式 subtle
- [ ] 光斑粒子：朦胧 blur 效果，呼吸透明度
- [ ] Hero 区域：左右分栏，左栏个人卡片，右栏音乐播放器
- [ ] 个人卡片：头像渐变、名字渐变、统计数字、社交图标
- [ ] 音乐播放器：进度条、播放控制、歌曲列表
- [ ] 歌词条：pill 形状、打字机效果、光标闪烁
- [ ] 深色模式：整体协调，粒子亮一些
- [ ] 浅色模式：整体协调，粒子淡一些
- [ ] 移动端：Hero 堆叠为单列，粒子数量减少
- [ ] 性能：页面滚动流畅，无卡顿
- [ ] 其他页面：无粒子特效（仅首页）

- [ ] **Step 3：最终提交**

```bash
git log --oneline -6
```
Expected: 看到 5-6 个里程碑 2 相关 commit

---

## 自我审查

### Spec 覆盖检查

| 设计文档要求 | 对应任务 |
|-------------|---------|
| Canvas 花瓣粒子系统 | Task 1 |
| 浮动光斑粒子 | Task 2 |
| Hero 左右分栏（个人卡片 + 音乐播放器）| Task 3 |
| 歌词条（打字机光标）| Task 4 |
| 首页整合 | Task 5 |
| 性能策略（RAF + delta time + reduced motion）| Task 1, 2 |
| 双模式适配 | 所有任务 |

### Placeholder 扫描

- [x] 无 "TBD"/"TODO"
- [x] 无模糊描述
- [x] 所有代码步骤有完整代码

### 类型一致性检查

- [x] PetalParticles 和 FloatingOrbs 均为 Client Component（"use client"）
- [x] Canvas 使用 `useRef<HTMLCanvasElement>`
- [x] 动画引用使用 `useRef<number>`
- [x] `formatTime` 函数签名一致
- [x] `HeroSectionProps.stats` 为可选（兼容旧调用）
- [x] `cn()` 已导入所有组件
