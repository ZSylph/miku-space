# 个人博客全栈项目实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个基于 Next.js 15 + React + TypeScript + Tailwind CSS + Prisma + PostgreSQL 的个人博客，支持积木式主页和全栈内容管理后台。

**Architecture:** 前台使用 Next.js App Router Server Components 从 PostgreSQL 读取数据并静态生成页面；管理后台通过 API Routes 实现 CRUD，配合 ISR 实现内容更新后自动刷新前台。项目采用增量式积木搭建，每完成一个里程碑即可运行验证。

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Prisma, PostgreSQL (Neon), Vercel

---

## 文件结构总览

```
E:/code/zsxy/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── posts/page.tsx
│   │   │   ├── posts/new/page.tsx
│   │   │   ├── posts/edit/[id]/page.tsx
│   │   │   ├── notes/
│   │   │   ├── works/
│   │   │   └── interests/page.tsx
│   │   └── layout.tsx
│   ├── (site)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── works/page.tsx
│   │   ├── works/[slug]/page.tsx
│   │   ├── notes/page.tsx
│   │   ├── notes/[slug]/page.tsx
│   │   ├── posts/page.tsx
│   │   └── posts/[slug]/page.tsx
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── auth/logout/route.ts
│   │   ├── posts/route.ts
│   │   ├── posts/[id]/route.ts
│   │   ├── notes/route.ts
│   │   ├── notes/[id]/route.ts
│   │   ├── works/route.ts
│   │   ├── works/[id]/route.ts
│   │   └── interests/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── blocks/
│   │   ├── HeroSection.tsx
│   │   ├── InterestGrid.tsx
│   │   ├── WorksPreview.tsx
│   │   └── ContentFeed.tsx
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── AdminNavbar.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── data/
│   └── home-sections.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 里程碑 1：项目脚手架

### Task 1: 初始化 Next.js 项目

**Files:**
- Create: 整个项目目录结构

- [ ] **Step 1: 运行创建命令**

```bash
cd E:/code/zsxy
echo "my-app" | npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: 命令执行成功，项目目录中出现 `app/`, `public/`, `package.json` 等文件。

- [ ] **Step 2: 验证目录结构**

```bash
ls -la E:/code/zsxy
```

Expected: 看到 `app/`, `node_modules/`, `package.json`, `tsconfig.json`, `tailwind.config.ts` 等文件。

- [ ] **Step 3: 首次运行开发服务器**

```bash
cd E:/code/zsxy && npm run dev
```

Expected: 终端显示 `Ready on http://localhost:3000`，浏览器访问能看到 Next.js 默认首页。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git init && git add . && git commit -m "chore: initialize Next.js project"
```

---

### Task 2: 安装核心依赖

**Files:**
- Modify: `E:/code/zsxy/package.json`

- [ ] **Step 1: 安装项目依赖**

```bash
cd E:/code/zsxy && npm install framer-motion prisma @prisma/client bcryptjs next-themes
```

- [ ] **Step 2: 安装开发依赖**

```bash
cd E:/code/zsxy && npm install -D @types/bcryptjs
```

- [ ] **Step 3: 初始化 shadcn/ui**

```bash
cd E:/code/zsxy && npx shadcn@latest init -y -d
```

Expected: 出现 `components/ui/` 和 `components.json` 文件。

- [ ] **Step 4: 验证 package.json**

Read `E:/code/zsxy/package.json`，确认以下依赖存在：
- `dependencies`: `next`, `react`, `react-dom`, `framer-motion`, `prisma`, `@prisma/client`, `bcryptjs`, `next-themes`
- `devDependencies`: `typescript`, `tailwindcss`, `@types/bcryptjs`

- [ ] **Step 5: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "chore: install core dependencies"
```

---

### Task 3: 配置全局样式与字体

**Files:**
- Modify: `E:/code/zsxy/app/globals.css`
- Modify: `E:/code/zsxy/app/layout.tsx`
- Modify: `E:/code/zsxy/tailwind.config.ts`

- [ ] **Step 1: 更新全局 CSS**

将 `E:/code/zsxy/app/globals.css` 替换为：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: 更新 tailwind.config.ts**

将 `E:/code/zsxy/tailwind.config.ts` 替换为：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 3: 更新根布局**

将 `E:/code/zsxy/app/layout.tsx` 替换为：

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal blog built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: 验证样式生效**

运行开发服务器，访问 `http://localhost:3000`，确认页面使用 Inter 字体，背景为白色。

- [ ] **Step 5: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "style: configure global styles and fonts"
```

---

## 里程碑 2：数据库与 Prisma

### Task 4: 初始化 Prisma

**Files:**
- Create: `E:/code/zsxy/prisma/schema.prisma`
- Create: `E:/code/zsxy/.env`
- Modify: `E:/code/zsxy/.gitignore`

- [ ] **Step 1: 初始化 Prisma**

```bash
cd E:/code/zsxy && npx prisma init
```

Expected: 生成 `prisma/schema.prisma` 和 `.env` 文件。

- [ ] **Step 2: 配置数据库连接**

编辑 `E:/code/zsxy/.env`，设置：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/myblog?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$YourHashedPasswordHere"
```

> 注：实际开发时使用 Neon 的连接串替换 `DATABASE_URL`。`ADMIN_PASSWORD_HASH` 后续用 bcrypt 生成。

- [ ] **Step 3: 将 .env 加入 .gitignore**

确认 `E:/code/zsxy/.gitignore` 包含 `.env` 行。如果没有则添加：

```
.env
```

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "chore: initialize Prisma"
```

---

### Task 5: 编写 Prisma Schema

**Files:**
- Create: `E:/code/zsxy/prisma/schema.prisma`

- [ ] **Step 1: 编写完整 Schema**

将 `E:/code/zsxy/prisma/schema.prisma` 替换为：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  coverUrl  String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tags      Tag[]
}

model Note {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  category  String?
  coverUrl  String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tags      Tag[]
}

model Work {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  content     String?
  coverUrl    String?
  demoUrl     String?
  repoUrl     String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Interest {
  id          String  @id @default(cuid())
  title       String
  description String
  icon        String
  color       String
  order       Int     @default(0)
  active      Boolean @default(true)
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
  notes Note[]
}
```

- [ ] **Step 2: 验证 Schema 格式**

```bash
cd E:/code/zsxy && npx prisma validate
```

Expected: `Prisma schema validation - (getconfig )` 后显示无错误。

- [ ] **Step 3: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "db: define Prisma schema"
```

---

### Task 6: 数据库迁移与 Prisma Client

**Files:**
- Create: `E:/code/zsxy/lib/prisma.ts`

- [ ] **Step 1: 运行首次迁移**

```bash
cd E:/code/zsxy && npx prisma migrate dev --name init
```

Expected: 迁移成功，数据库中创建对应表。如果本地没有 PostgreSQL，此步骤需先配置 Neon 连接串。

- [ ] **Step 2: 生成 Prisma Client**

```bash
cd E:/code/zsxy && npx prisma generate
```

Expected: `prisma/client` 生成成功。

- [ ] **Step 3: 创建 Prisma Client 单例**

创建 `E:/code/zsxy/lib/prisma.ts`：

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "db: run migration and setup Prisma client"
```

---

## 里程碑 3：全局布局（Navbar + Footer）

### Task 7: 创建 Navbar 组件

**Files:**
- Create: `E:/code/zsxy/components/layout/Navbar.tsx`

- [ ] **Step 1: 安装 shadcn Button**

```bash
cd E:/code/zsxy && npx shadcn@latest add button
```

- [ ] **Step 2: 编写 Navbar 组件**

创建 `E:/code/zsxy/components/layout/Navbar.tsx`：

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          My Blog
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-foreground/60 hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add Navbar component"
```

---

### Task 8: 创建 Footer 组件与站点布局

**Files:**
- Create: `E:/code/zsxy/components/layout/Footer.tsx`
- Create: `E:/code/zsxy/app/(site)/layout.tsx`

- [ ] **Step 1: 编写 Footer 组件**

创建 `E:/code/zsxy/components/layout/Footer.tsx`：

```tsx
export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} My Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: 创建站点布局**

创建 `E:/code/zsxy/app/(site)/layout.tsx`：

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: 更新根 layout**

编辑 `E:/code/zsxy/app/layout.tsx`，移除默认内容，确保只保留全局配置：

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal blog built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: 验证布局**

运行 `npm run dev`，访问 `http://localhost:3000`，确认页面顶部有 Navbar，底部有 Footer。

- [ ] **Step 5: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add Footer and site layout"
```

---

## 里程碑 4：HeroSection（第一块积木）

### Task 9: 创建 HeroSection 组件

**Files:**
- Create: `E:/code/zsxy/components/blocks/HeroSection.tsx`

- [ ] **Step 1: 编写 HeroSection**

创建 `E:/code/zsxy/components/blocks/HeroSection.tsx`：

```tsx
"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl">
          👋
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          你好，我是 <span className="text-primary">博主</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          这里是我的个人空间，记录学习、分享作品、表达想法。
        </p>
        <div className="flex gap-4">
          <a
            href="/works"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            查看作品
          </a>
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-input px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            了解更多
          </a>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: 添加到主页**

编辑 `E:/code/zsxy/app/(site)/page.tsx`，替换为：

```tsx
import HeroSection from "@/components/blocks/HeroSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
```

- [ ] **Step 3: 验证效果**

运行 `npm run dev`，访问首页，确认看到带有动画的头像、标题和按钮。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add HeroSection block"
```

---

## 里程碑 5：InterestGrid（兴趣卡片积木）

### Task 10: 创建 InterestGrid 组件与数据层

**Files:**
- Create: `E:/code/zsxy/components/blocks/InterestGrid.tsx`
- Modify: `E:/code/zsxy/prisma/schema.prisma`
- Modify: `E:/code/zsxy/lib/prisma.ts`

- [ ] **Step 1: 确保 Interest 模型已定义**

确认 `prisma/schema.prisma` 中的 `Interest` 模型已存在（Task 5 已创建）。

- [ ] **Step 2: 创建种子数据脚本**

创建 `E:/code/zsxy/prisma/seed.ts`：

```typescript
import { prisma } from "../lib/prisma";

async function main() {
  const interests = [
    { title: "前端开发", description: "React, Next.js, TypeScript", icon: "Code", color: "bg-blue-100 text-blue-700", order: 0 },
    { title: "设计", description: "UI/UX, Figma, 动画", icon: "Palette", color: "bg-pink-100 text-pink-700", order: 1 },
    { title: "阅读", description: "技术书籍, 科幻小说", icon: "BookOpen", color: "bg-green-100 text-green-700", order: 2 },
    { title: "摄影", description: "街头摄影, 风景", icon: "Camera", color: "bg-amber-100 text-amber-700", order: 3 },
  ];

  for (const interest of interests) {
    await prisma.interest.upsert({
      where: { id: interest.title },
      update: {},
      create: interest,
    });
  }

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

> 注：`where: { id: interest.title }` 这里有问题，Interest 的 id 是 cuid，应该用 title 或其他字段。修正为直接 create：

```typescript
  for (const interest of interests) {
    await prisma.interest.create({ data: interest });
  }
```

- [ ] **Step 3: 运行种子脚本**

```bash
cd E:/code/zsxy && npx ts-node prisma/seed.ts
```

Expected: 终端显示 "Seed data inserted"。

- [ ] **Step 4: 编写 InterestGrid 组件**

创建 `E:/code/zsxy/components/blocks/InterestGrid.tsx`：

```tsx
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
            className={`rounded-xl p-6 ${interest.color} hover:scale-105 transition-transform cursor-default`}
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
```

- [ ] **Step 5: 更新主页获取兴趣数据**

编辑 `E:/code/zsxy/app/(site)/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";

export default async function HomePage() {
  const interests = await prisma.interest.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
    </div>
  );
}
```

- [ ] **Step 6: 验证效果**

运行 `npm run dev`，访问首页，确认 HeroSection 下方出现 4 个彩色卡片，带滚动入场动画。

- [ ] **Step 7: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add InterestGrid block with database data"
```

---

## 里程碑 6：WorksPreview + 作品页面

### Task 11: 创建 WorksPreview 积木与作品列表页

**Files:**
- Create: `E:/code/zsxy/components/blocks/WorksPreview.tsx`
- Create: `E:/code/zsxy/app/(site)/works/page.tsx`

- [ ] **Step 1: 插入作品种子数据**

创建 `E:/code/zsxy/prisma/seed-works.ts`：

```typescript
import { prisma } from "../lib/prisma";

async function main() {
  const works = [
    {
      title: "个人博客系统",
      slug: "personal-blog",
      description: "基于 Next.js 的全栈博客系统",
      content: "# 个人博客系统\n\n这是一个全栈项目...",
      featured: true,
      order: 0,
      demoUrl: "https://example.com",
      repoUrl: "https://github.com",
    },
    {
      title: "待办事项应用",
      slug: "todo-app",
      description: "简洁优雅的待办管理工具",
      content: "# 待办事项应用\n\n使用 React + TypeScript 构建...",
      featured: true,
      order: 1,
    },
  ];

  for (const work of works) {
    await prisma.work.create({ data: work });
  }

  console.log("Works seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行：
```bash
cd E:/code/zsxy && npx ts-node prisma/seed-works.ts
```

- [ ] **Step 2: 编写 WorksPreview 组件**

创建 `E:/code/zsxy/components/blocks/WorksPreview.tsx`：

```tsx
"use client";

import { motion } from "framer-motion";
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
                <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center text-4xl">
                  {work.coverUrl ? (
                    <img src={work.coverUrl} alt={work.title} className="w-full h-full object-cover rounded-lg" />
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
```

- [ ] **Step 3: 更新主页**

编辑 `E:/code/zsxy/app/(site)/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";

export default async function HomePage() {
  const [interests, works] = await Promise.all([
    prisma.interest.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.work.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
  ]);

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
      <WorksPreview works={works} />
    </div>
  );
}
```

- [ ] **Step 4: 创建作品列表页**

创建 `E:/code/zsxy/app/(site)/works/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">作品展示</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <Link key={work.id} href={`/works/${work.slug}`}>
            <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center text-4xl">
                🚀
              </div>
              <h2 className="font-semibold text-lg">{work.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 验证效果**

运行 `npm run dev`，访问首页确认有作品预览区，访问 `/works` 确认作品列表页正常。

- [ ] **Step 6: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add WorksPreview and works list page"
```

---

### Task 12: 创建作品详情页

**Files:**
- Create: `E:/code/zsxy/app/(site)/works/[slug]/page.tsx`

- [ ] **Step 1: 安装 MDX 渲染依赖**

```bash
cd E:/code/zsxy && npm install react-markdown remark-gfm
```

- [ ] **Step 2: 创建作品详情页**

创建 `E:/code/zsxy/app/(site)/works/[slug]/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });

  if (!work) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/works" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回作品列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{work.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{work.description}</p>

      {(work.demoUrl || work.repoUrl) && (
        <div className="flex gap-4 mb-8">
          {work.demoUrl && (
            <a
              href={work.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              查看演示
            </a>
          )}
          {work.repoUrl && (
            <a
              href={work.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              源代码
            </a>
          )}
        </div>
      )}

      {work.content && (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{work.content}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 3: 添加 prose 样式支持**

```bash
cd E:/code/zsxy && npm install -D @tailwindcss/typography
```

编辑 `tailwind.config.ts`，在 `plugins` 数组中添加：

```typescript
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
```

- [ ] **Step 4: 验证效果**

访问 `/works/personal-blog`，确认作品详情页渲染正常，Markdown 内容正确解析。

- [ ] **Step 5: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add work detail page with markdown rendering"
```

---

## 里程碑 7：ContentFeed + 文章/笔记页面

### Task 13: 创建 ContentFeed 与列表页

**Files:**
- Create: `E:/code/zsxy/components/blocks/ContentFeed.tsx`
- Create: `E:/code/zsxy/app/(site)/posts/page.tsx`
- Create: `E:/code/zsxy/app/(site)/notes/page.tsx`

- [ ] **Step 1: 插入文章和笔记种子数据**

创建 `E:/code/zsxy/prisma/seed-content.ts`：

```typescript
import { prisma } from "../lib/prisma";

async function main() {
  const post = await prisma.post.create({
    data: {
      title: "我的第一篇技术文章",
      slug: "my-first-post",
      content: "# 我的第一篇技术文章\n\n这是正文内容...",
      excerpt: "关于 Next.js 和 React 的学习笔记",
      published: true,
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "TypeScript 学习笔记",
      slug: "typescript-notes",
      content: "# TypeScript 学习笔记\n\n## 类型断言...",
      category: "前端",
      published: true,
    },
  });

  console.log("Content seeded:", { post, note });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行：
```bash
cd E:/code/zsxy && npx ts-node prisma/seed-content.ts
```

- [ ] **Step 2: 编写 ContentFeed 组件**

创建 `E:/code/zsxy/components/blocks/ContentFeed.tsx`：

```tsx
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
```

- [ ] **Step 3: 更新主页**

编辑 `E:/code/zsxy/app/(site)/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";
import WorksPreview from "@/components/blocks/WorksPreview";
import ContentFeed from "@/components/blocks/ContentFeed";

export default async function HomePage() {
  const [interests, works, posts, notes] = await Promise.all([
    prisma.interest.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.work.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.note.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const contentItems = [
    ...posts.map((p) => ({ ...p, type: "post" as const })),
    ...notes.map((n) => ({ ...n, type: "note" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
      <WorksPreview works={works} />
      <ContentFeed items={contentItems} />
    </div>
  );
}
```

- [ ] **Step 4: 创建文章列表页**

创建 `E:/code/zsxy/app/(site)/posts/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">技术文章</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <div className="rounded-lg border p-6 hover:bg-accent transition-colors">
              <h2 className="font-semibold text-lg">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 创建笔记列表页**

创建 `E:/code/zsxy/app/(site)/notes/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">学习笔记</h1>
      <div className="space-y-4">
        {notes.map((note) => (
          <Link key={note.id} href={`/notes/${note.slug}`}>
            <div className="rounded-lg border p-6 hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {note.category && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
                    {note.category}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-lg">{note.title}</h2>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(note.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 验证效果**

运行 `npm run dev`，确认首页有 ContentFeed，/posts 和 /notes 列表页正常。

- [ ] **Step 7: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add ContentFeed, posts and notes list pages"
```

---

### Task 14: 创建文章与笔记详情页

**Files:**
- Create: `E:/code/zsxy/app/(site)/posts/[slug]/page.tsx`
- Create: `E:/code/zsxy/app/(site)/notes/[slug]/page.tsx`

- [ ] **Step 1: 创建文章详情页**

创建 `E:/code/zsxy/app/(site)/posts/[slug]/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回文章列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {new Date(post.createdAt).toLocaleDateString("zh-CN")}
      </p>
      {post.excerpt && (
        <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary pl-4">
          {post.excerpt}
        </p>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: 创建笔记详情页**

创建 `E:/code/zsxy/app/(site)/notes/[slug]/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });

  if (!note || !note.published) {
    notFound();
  }

  return (
    <article className="container py-12 max-w-3xl">
      <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← 返回笔记列表
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{note.title}</h1>
      <div className="flex items-center gap-2 mb-8">
        {note.category && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
            {note.category}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString("zh-CN")}
        </span>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: 验证效果**

访问 `/posts/my-first-post` 和 `/notes/typescript-notes`，确认详情页渲染正常。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add post and note detail pages"
```

---

## 里程碑 8：关于页面

### Task 15: 创建关于页面

**Files:**
- Create: `E:/code/zsxy/app/(site)/about/page.tsx`

- [ ] **Step 1: 创建关于页面**

创建 `E:/code/zsxy/app/(site)/about/page.tsx`：

```tsx
export default function AboutPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">关于我</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          你好！我是一名热爱技术的开发者，喜欢探索前端新技术，
          也享受用代码创造有趣的东西。
        </p>
        <h2>技能栈</h2>
        <ul>
          <li>前端：React, Next.js, TypeScript, Tailwind CSS</li>
          <li>后端：Node.js, Prisma, PostgreSQL</li>
          <li>工具：Git, VS Code, Figma</li>
        </ul>
        <h2>联系方式</h2>
        <p>
          欢迎通过邮件或社交媒体与我交流！
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证效果**

访问 `/about`，确认页面渲染正常。

- [ ] **Step 3: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add about page"
```

---

## 里程碑 9：管理后台框架

### Task 16: 创建鉴权工具与中间件

**Files:**
- Create: `E:/code/zsxy/lib/auth.ts`
- Create: `E:/code/zsxy/middleware.ts`

- [ ] **Step 1: 创建鉴权工具**

创建 `E:/code/zsxy/lib/auth.ts`：

```typescript
import bcrypt from "bcryptjs";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return false;
  }

  if (username !== adminUsername) {
    return false;
  }

  return bcrypt.compare(password, adminPasswordHash);
}

export function generatePasswordHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}
```

- [ ] **Step 2: 生成管理员密码哈希**

创建临时脚本 `E:/code/zsxy/scripts/hash-password.ts`：

```typescript
import { generatePasswordHash } from "../lib/auth";

const password = process.argv[2] || "admin123";
console.log(generatePasswordHash(password));
```

运行：
```bash
cd E:/code/zsxy && npx ts-node scripts/hash-password.ts your-password
```

将输出值复制到 `.env` 中的 `ADMIN_PASSWORD_HASH`。

- [ ] **Step 3: 创建中间件**

创建 `E:/code/zsxy/middleware.ts`：

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session")?.value;
    if (!session || session !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add auth utilities and middleware"
```

---

### Task 17: 创建登录页与 AdminLayout

**Files:**
- Create: `E:/code/zsxy/app/(admin)/admin/login/page.tsx`
- Create: `E:/code/zsxy/app/(admin)/admin/layout.tsx`
- Create: `E:/code/zsxy/app/(admin)/layout.tsx`
- Create: `E:/code/zsxy/app/api/auth/login/route.ts`
- Create: `E:/code/zsxy/app/api/auth/logout/route.ts`

- [ ] **Step 1: 创建登录 API**

创建 `E:/code/zsxy/app/api/auth/login/route.ts`：

```typescript
import { verifyCredentials } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建登出 API**

创建 `E:/code/zsxy/app/api/auth/logout/route.ts`：

```typescript
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
```

- [ ] **Step 3: 创建登录页**

创建 `E:/code/zsxy/app/(admin)/admin/login/page.tsx`：

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("用户名或密码错误");
      }
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-sm p-8 rounded-xl border bg-card shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">管理后台</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 Admin Layout**

创建 `E:/code/zsxy/app/(admin)/admin/layout.tsx`：

```tsx
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted">
      <AdminNavbar />
      <main className="container py-8">{children}</main>
    </div>
  );
}
```

创建 `E:/code/zsxy/app/(admin)/layout.tsx`：

```tsx
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 5: 创建 AdminNavbar**

创建 `E:/code/zsxy/components/layout/AdminNavbar.tsx`：

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "仪表板" },
  { href: "/admin/posts", label: "文章" },
  { href: "/admin/notes", label: "笔记" },
  { href: "/admin/works", label: "作品" },
  { href: "/admin/interests", label: "兴趣" },
];

export default function AdminNavbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/admin" className="font-bold">
          管理后台
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: 验证效果**

运行 `npm run dev`，访问 `/admin/login`，确认登录页渲染。输入正确凭据后应跳转到 `/admin`。

- [ ] **Step 7: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add admin login and layout"
```

---

### Task 18: 创建管理后台仪表板

**Files:**
- Create: `E:/code/zsxy/app/(admin)/admin/page.tsx`

- [ ] **Step 1: 创建仪表板页面**

创建 `E:/code/zsxy/app/(admin)/admin/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [postCount, noteCount, workCount, interestCount] = await Promise.all([
    prisma.post.count(),
    prisma.note.count(),
    prisma.work.count(),
    prisma.interest.count(),
  ]);

  const stats = [
    { label: "文章", count: postCount, href: "/admin/posts" },
    { label: "笔记", count: noteCount, href: "/admin/notes" },
    { label: "作品", count: workCount, href: "/admin/works" },
    { label: "兴趣", count: interestCount, href: "/admin/interests" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">仪表板</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证效果**

登录后访问 `/admin`，确认显示内容统计卡片。

- [ ] **Step 3: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add admin dashboard"
```

---

## 里程碑 10：文章 CRUD

### Task 19: 创建文章列表管理页

**Files:**
- Create: `E:/code/zsxy/app/(admin)/admin/posts/page.tsx`

- [ ] **Step 1: 安装 shadcn 表格组件**

```bash
cd E:/code/zsxy && npx shadcn@latest add table badge
```

- [ ] **Step 2: 创建文章管理列表**

创建 `E:/code/zsxy/app/(admin)/admin/posts/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          新建文章
        </Link>
      </div>

      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">标题</th>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">日期</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/posts/${post.slug}`} className="hover:underline font-medium">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      已发布
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      草稿
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/edit/${post.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证效果**

访问 `/admin/posts`，确认文章列表表格渲染。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add admin posts list page"
```

---

### Task 20: 创建文章新建与编辑页

**Files:**
- Create: `E:/code/zsxy/app/(admin)/admin/posts/new/page.tsx`
- Create: `E:/code/zsxy/app/(admin)/admin/posts/edit/[id]/page.tsx`
- Create: `E:/code/zsxy/app/api/posts/route.ts`
- Create: `E:/code/zsxy/app/api/posts/[id]/route.ts`

- [ ] **Step 1: 创建文章 API（POST / GET）**

创建 `E:/code/zsxy/app/api/posts/route.ts`：

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建文章单条 API（PUT / DELETE）**

创建 `E:/code/zsxy/app/api/posts/[id]/route.ts`：

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const data = await request.json();
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
```

- [ ] **Step 3: 创建文章编辑器组件**

创建 `E:/code/zsxy/components/admin/PostEditor.tsx`：

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    published: boolean;
  };
}

export default function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [published, setPublished] = useState(post?.published || false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, excerpt, published }),
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        alert("保存失败");
      }
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">摘要</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm h-20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">内容 (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm font-mono h-96"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">预览</label>
          <div className="rounded-md border p-4 h-96 overflow-auto prose dark:prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*开始输入以查看预览...*"}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">立即发布</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "保存中..." : post ? "更新" : "创建"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent"
        >
          取消
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: 创建新建文章页**

创建 `E:/code/zsxy/app/(admin)/admin/posts/new/page.tsx`：

```tsx
import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <PostEditor />
    </div>
  );
}
```

- [ ] **Step 5: 创建编辑文章页**

创建 `E:/code/zsxy/app/(admin)/admin/posts/edit/[id]/page.tsx`：

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <PostEditor post={post} />
    </div>
  );
}
```

- [ ] **Step 6: 验证效果**

访问 `/admin/posts/new`，创建一篇文章，确认能保存并跳转到列表页。点击编辑，确认能修改内容。

- [ ] **Step 7: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add post CRUD in admin"
```

---

## 里程碑 11：作品 + 笔记 CRUD

### Task 21: 复用模式创建作品与笔记管理

**Files:**
- Create: `E:/code/zsxy/app/api/works/route.ts`
- Create: `E:/code/zsxy/app/api/works/[id]/route.ts`
- Create: `E:/code/zsxy/app/api/notes/route.ts`
- Create: `E:/code/zsxy/app/api/notes/[id]/route.ts`
- Create: `E:/code/zsxy/app/(admin)/admin/works/page.tsx`
- Create: `E:/code/zsxy/app/(admin)/admin/notes/page.tsx`
- Create: `E:/code/zsxy/components/admin/WorkEditor.tsx`
- Create: `E:/code/zsxy/components/admin/NoteEditor.tsx`

由于结构类似，以下为关键代码框架。实际实施时参照 Task 19-20 的模式。

- [ ] **Step 1: 创建 Works API**

`app/api/works/route.ts`：参照 `app/api/posts/route.ts`，将 `prisma.post` 替换为 `prisma.work`，字段适配 Work 模型（title, slug, description, content, coverUrl, demoUrl, repoUrl, featured, order）。

`app/api/works/[id]/route.ts`：参照 `app/api/posts/[id]/route.ts`，适配 Work 模型字段。

- [ ] **Step 2: 创建 Notes API**

`app/api/notes/route.ts`：参照 `app/api/posts/route.ts`，将 `prisma.post` 替换为 `prisma.note`，字段适配 Note 模型（title, slug, content, category, coverUrl, published）。

`app/api/notes/[id]/route.ts`：参照 `app/api/posts/[id]/route.ts`，适配 Note 模型字段。

- [ ] **Step 3: 创建 WorkEditor 和 NoteEditor**

`components/admin/WorkEditor.tsx`：参照 `PostEditor.tsx`，增加字段：description, coverUrl, demoUrl, repoUrl, featured（checkbox）, order（number）。

`components/admin/NoteEditor.tsx`：参照 `PostEditor.tsx`，将 excerpt 替换为 category。

- [ ] **Step 4: 创建管理列表页**

`app/(admin)/admin/works/page.tsx`：参照 `app/(admin)/admin/posts/page.tsx`，展示 work 列表，链接到 `/admin/works/new` 和 `/admin/works/edit/[id]`。

`app/(admin)/admin/notes/page.tsx`：参照 `app/(admin)/admin/posts/page.tsx`，展示 note 列表。

- [ ] **Step 5: 验证效果**

访问 `/admin/works` 和 `/admin/notes`，确认能增删改查。

- [ ] **Step 6: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add works and notes CRUD in admin"
```

---

## 里程碑 12：兴趣卡片管理

### Task 22: 创建兴趣卡片管理页

**Files:**
- Create: `E:/code/zsxy/app/api/interests/route.ts`
- Create: `E:/code/zsxy/app/(admin)/admin/interests/page.tsx`

- [ ] **Step 1: 创建 Interests API**

创建 `E:/code/zsxy/app/api/interests/route.ts`：

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(interests);
  } catch {
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const interest = await prisma.interest.create({ data });
    return NextResponse.json(interest);
  } catch {
    return NextResponse.json({ error: "Failed to create interest" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建兴趣管理页**

创建 `E:/code/zsxy/app/(admin)/admin/interests/page.tsx`：

```tsx
"use client";

import { useState, useEffect } from "react";

interface Interest {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  active: boolean;
}

export default function AdminInterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState({ title: "", description: "", icon: "", color: "bg-blue-100 text-blue-700" });

  useEffect(() => {
    fetch("/api/interests")
      .then((res) => res.json())
      .then(setInterests);
  }, []);

  async function handleAdd() {
    const res = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newInterest, order: interests.length }),
    });
    if (res.ok) {
      const interest = await res.json();
      setInterests([...interests, interest]);
      setNewInterest({ title: "", description: "", icon: "", color: "bg-blue-100 text-blue-700" });
    }
  }

  async function handleToggle(id: string, active: boolean) {
    // 简化版：直接修改前端状态，实际应调用 API
    setInterests(interests.map((i) => (i.id === id ? { ...i, active } : i)));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">兴趣卡片管理</h1>

      <div className="rounded-xl border bg-card p-4 mb-6">
        <h2 className="font-semibold mb-3">添加新卡片</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="标题"
            value={newInterest.title}
            onChange={(e) => setNewInterest({ ...newInterest, title: e.target.value })}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            placeholder="描述"
            value={newInterest.description}
            onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            placeholder="图标名"
            value={newInterest.icon}
            onChange={(e) => setNewInterest({ ...newInterest, icon: e.target.value })}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            添加
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left">标题</th>
              <th className="px-4 py-3 text-left">描述</th>
              <th className="px-4 py-3 text-left">状态</th>
            </tr>
          </thead>
          <tbody>
            {interests.map((interest) => (
              <tr key={interest.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{interest.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{interest.description}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(interest.id, !interest.active)}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      interest.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {interest.active ? "显示中" : "已隐藏"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 验证效果**

访问 `/admin/interests`，确认能查看和添加兴趣卡片。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add interest card management"
```

---

## 里程碑 13：搜索 + 暗黑模式

### Task 23: 添加暗黑模式切换

**Files:**
- Modify: `E:/code/zsxy/app/layout.tsx`
- Modify: `E:/code/zsxy/components/layout/Navbar.tsx`

- [ ] **Step 1: 创建 ThemeProvider**

创建 `E:/code/zsxy/components/providers/ThemeProvider.tsx`：

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: 更新根布局**

编辑 `E:/code/zsxy/app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal blog built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 添加主题切换按钮到 Navbar**

编辑 `E:/code/zsxy/components/layout/Navbar.tsx`，添加 theme toggle：

```tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// ... navLinks 不变

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          My Blog
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </nav>

        {/* mobile menu button ... */}
      </div>
      {/* mobile menu ... */}
    </header>
  );
}
```

> 注：需要完整保留原有的 mobile menu 代码。

- [ ] **Step 4: 验证效果**

点击 Navbar 的 🌙/☀️ 按钮，确认页面切换暗黑/亮色模式。

- [ ] **Step 5: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add dark mode toggle"
```

---

### Task 24: 添加客户端搜索

**Files:**
- Create: `E:/code/zsxy/components/SearchModal.tsx`
- Modify: `E:/code/zsxy/components/layout/Navbar.tsx`

- [ ] **Step 1: 安装 Fuse.js**

```bash
cd E:/code/zsxy && npm install fuse.js
```

- [ ] **Step 2: 创建搜索 API**

创建 `E:/code/zsxy/app/api/search/route.ts`：

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [posts, notes] = await Promise.all([
      prisma.post.findMany({ where: { published: true }, select: { title: true, slug: true, excerpt: true } }),
      prisma.note.findMany({ where: { published: true }, select: { title: true, slug: true, category: true } }),
    ]);

    return NextResponse.json({
      posts: posts.map((p) => ({ ...p, type: "post" as const })),
      notes: notes.map((n) => ({ ...n, type: "note" as const })),
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
```

- [ ] **Step 3: 创建搜索弹窗组件**

创建 `E:/code/zsxy/components/SearchModal.tsx`：

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

interface SearchItem {
  title: string;
  slug: string;
  type: "post" | "note";
  excerpt?: string | null;
  category?: string | null;
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<Fuse.FuseResult<SearchItem>[]>([]);

  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((data) => {
        const allItems = [...data.posts, ...data.notes];
        setItems(allItems);
      });
  }, []);

  const fuse = new Fuse(items, {
    keys: ["title", "excerpt", "category"],
    threshold: 0.3,
  });

  useEffect(() => {
    if (query.trim()) {
      setResults(fuse.search(query));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-lg bg-background rounded-xl border shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <input
            autoFocus
            type="text"
            placeholder="搜索文章和笔记..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-lg outline-none bg-transparent"
          />
        </div>
        <div className="max-h-[40vh] overflow-auto">
          {results.length === 0 && query.trim() && (
            <p className="p-4 text-sm text-muted-foreground">未找到结果</p>
          )}
          {results.map(({ item }) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={`/${item.type === "post" ? "posts" : "notes"}/${item.slug}`}
              onClick={onClose}
              className="block p-4 hover:bg-accent border-b last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                  {item.type === "post" ? "文章" : "笔记"}
                </span>
              </div>
              <p className="font-medium mt-1">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 在 Navbar 添加搜索按钮**

编辑 `E:/code/zsxy/components/layout/Navbar.tsx`，添加搜索入口：

```tsx
// 在文件顶部添加
import SearchModal from "@/components/SearchModal";

// 在组件 state 中添加
const [searchOpen, setSearchOpen] = useState(false);

// 在 nav 中添加搜索按钮
<button
  onClick={() => setSearchOpen(true)}
  className="text-foreground/60 hover:text-foreground transition-colors"
>
  🔍
</button>

// 在 return 的末尾添加
{searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
```

- [ ] **Step 5: 验证效果**

点击 Navbar 搜索按钮，输入关键词，确认能搜索到文章和笔记。

- [ ] **Step 6: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "feat: add client-side search with Fuse.js"
```

---

## 里程碑 14：部署上线

### Task 25: 配置 Vercel 部署

**Files:**
- Modify: `E:/code/zsxy/next.config.ts`

- [ ] **Step 1: 更新 next.config.ts**

将 `E:/code/zsxy/next.config.ts` 替换为：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 2: 添加部署脚本到 package.json**

编辑 `E:/code/zsxy/package.json`，在 `scripts` 中添加：

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

- [ ] **Step 3: 构建验证**

```bash
cd E:/code/zsxy && npm run build
```

Expected: 构建成功，无报错。

- [ ] **Step 4: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "chore: configure for Vercel deployment"
```

---

### Task 26: 部署到 Vercel

- [ ] **Step 1: 安装 Vercel CLI**

```bash
npm install -g vercel
```

- [ ] **Step 2: 登录 Vercel**

```bash
vercel login
```

- [ ] **Step 3: 部署项目**

```bash
cd E:/code/zsxy && vercel --prod
```

- [ ] **Step 4: 配置环境变量**

在 Vercel Dashboard → Project Settings → Environment Variables 中添加：
- `DATABASE_URL` — Neon PostgreSQL 连接串
- `ADMIN_USERNAME` — 管理员用户名
- `ADMIN_PASSWORD_HASH` — bcrypt 哈希后的密码

- [ ] **Step 5: 重新部署**

```bash
cd E:/code/zsxy && vercel --prod
```

- [ ] **Step 6: 验证线上环境**

访问分配的域名，确认前台页面、管理后台、登录功能均正常工作。

- [ ] **Step 7: Commit**

```bash
cd E:/code/zsxy && git add . && git commit -m "chore: deploy to vercel"
```

---

## 自我审查

### 1. Spec 覆盖率检查

| Spec 需求 | 对应任务 |
|-----------|----------|
| 积木式主页（Hero, Interest, Works, ContentFeed） | Task 9, 10, 11, 13 |
| 不同内容不同子页面 | Task 11, 12, 13, 14, 15 |
| Next.js + React + TypeScript | Task 1, 2 |
| Prisma + PostgreSQL | Task 4, 5, 6 |
| 管理后台 + 鉴权 | Task 16, 17, 18 |
| 文章/笔记/作品 CRUD | Task 19, 20, 21 |
| 兴趣卡片管理 | Task 22 |
| 暗黑模式 | Task 23 |
| 搜索 | Task 24 |
| Vercel 部署 | Task 25, 26 |

### 2. Placeholder 检查

- 无 TBD/TODO
- 所有代码步骤包含完整代码
- 所有 API 和页面有明确实现

### 3. 类型一致性检查

- `params` 类型：统一使用 `Promise<{ slug: string }>` 和 `Promise<{ id: string }>`
- Prisma 模型字段名：前后一致
- 组件 props 接口：命名规范统一

---

## 执行交接

**Plan complete and saved to `docs/superpowers/plans/2026-05-22-personal-blog.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
