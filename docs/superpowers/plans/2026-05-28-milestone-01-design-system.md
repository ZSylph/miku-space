# 里程碑 1：设计系统 + 全局组件 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立完整的 Miku Space 设计系统（色彩、字体、玻璃拟态工具类），并完成全局组件（导航栏、页脚、按钮）的重构。

**Architecture:** 使用 Tailwind CSS v4 的 `@theme inline` 扩展自定义设计令牌，通过 CSS 变量实现深色/浅色双模式。玻璃拟态效果通过统一的工具类管理。按钮组件使用 CVA（class-variance-authority）管理变体。

**Tech Stack:** Next.js 16, Tailwind CSS v4, next-themes, next/font, lucide-react, class-variance-authority

---

## 文件结构映射

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/globals.css` | 修改 | 自定义颜色变量、玻璃拟态工具类、全局基础样式 |
| `app/layout.tsx` | 修改 | 加载 Outfit 字体、更新 metadata、配置 ThemeProvider |
| `components/ui/Button.tsx` | 创建 | 通用按钮组件（4 种变体） |
| `components/layout/Navbar.tsx` | 重写 | 毛玻璃悬浮导航栏 |
| `components/layout/Footer.tsx` | 重写 | 毛玻璃页脚 |
| `app/(site)/layout.tsx` | 修改 | 站点整体布局调整 |

---

## Task 1：更新全局样式（globals.css）

**Files:**
- Modify: `app/globals.css`

**上下文：** Tailwind CSS v4 使用 `@theme inline` 定义主题令牌。当前文件已存在 shadcn/ui base-nova 的基础配置，需要扩展自定义颜色并添加玻璃拟态工具类。

- [ ] **Step 1：备份当前文件**

Run: `cp app/globals.css app/globals.css.bak`

- [ ] **Step 2：添加自定义颜色到 @theme inline**

在 `app/globals.css` 的 `@theme inline` 区块中，在 `--font-heading` 行之后添加以下自定义颜色：

```css
@theme inline {
  /* ... existing variables ... */
  --font-heading: var(--font-sans);

  /* Miku Space Custom Colors */
  --color-miku-primary: #A8E6E1;
  --color-miku-primary-light: #C8F0EC;
  --color-miku-primary-dark: #7DD9D2;
  --color-miku-pink: #F5C6D0;
  --color-miku-cyan: #C8F0EC;

  /* Dark mode backgrounds */
  --color-dark-base: #0D0D1A;
  --color-dark-card: rgba(255, 255, 255, 0.04);
  --color-dark-card-hover: rgba(255, 255, 255, 0.06);
  --color-dark-border: rgba(255, 255, 255, 0.08);

  /* Light mode backgrounds */
  --color-light-base: #FFF5F7;
  --color-light-blue-tint: #F0F8FF;
  --color-light-cyan-tint: #F0FFFE;
  --color-light-card: rgba(255, 255, 255, 0.65);
  --color-light-card-hover: rgba(255, 255, 255, 0.85);
  --color-light-border: rgba(168, 230, 225, 0.25);
}
```

- [ ] **Step 3：更新 :root 和 .dark 变量**

将 `:root` 和 `.dark` 区块更新为双模式设计令牌：

```css
:root {
  --background: #FFF5F7;
  --foreground: #2D2D3A;
  --card: rgba(255, 255, 255, 0.65);
  --card-foreground: #2D2D3A;
  --popover: rgba(255, 255, 255, 0.8);
  --popover-foreground: #2D2D3A;
  --primary: #A8E6E1;
  --primary-foreground: #2D2D3A;
  --secondary: rgba(168, 230, 225, 0.15);
  --secondary-foreground: #2D2D3A;
  --muted: rgba(168, 230, 225, 0.1);
  --muted-foreground: #8A8A9A;
  --accent: rgba(168, 230, 225, 0.15);
  --accent-foreground: #2D2D3A;
  --destructive: #F5C6D0;
  --destructive-foreground: #2D2D3A;
  --border: rgba(168, 230, 225, 0.25);
  --input: rgba(168, 230, 225, 0.2);
  --ring: #A8E6E1;
  --radius: 0.75rem;
}

.dark {
  --background: #0D0D1A;
  --foreground: #FFFFFF;
  --card: rgba(255, 255, 255, 0.04);
  --card-foreground: #FFFFFF;
  --popover: rgba(255, 255, 255, 0.06);
  --popover-foreground: #FFFFFF;
  --primary: #A8E6E1;
  --primary-foreground: #0D0D1A;
  --secondary: rgba(255, 255, 255, 0.06);
  --secondary-foreground: #FFFFFF;
  --muted: rgba(255, 255, 255, 0.04);
  --muted-foreground: #8A8A9A;
  --accent: rgba(255, 255, 255, 0.06);
  --accent-foreground: #FFFFFF;
  --destructive: #F5C6D0;
  --destructive-foreground: #0D0D1A;
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.08);
  --ring: #A8E6E1;
  --radius: 0.75rem;
}
```

- [ ] **Step 4：添加玻璃拟态工具类**

在 `@layer base` 之后添加：

```css
@layer utilities {
  .glass {
    @apply bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)];
  }

  .glass-light {
    @apply bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)];
  }

  .glass-hover {
    @apply transition-all duration-300;
  }

  .glass-hover:hover {
    @apply bg-[rgba(255,255,255,0.06)] -translate-y-0.5;
    box-shadow: 0 8px 32px rgba(168, 230, 225, 0.12);
  }

  .glass-light-hover:hover {
    @apply bg-[rgba(255,255,255,0.85)] -translate-y-0.5;
    box-shadow: 0 8px 32px rgba(168, 230, 225, 0.15);
  }

  .text-gradient {
    @apply bg-gradient-to-r from-miku-primary to-miku-primary-light bg-clip-text text-transparent;
  }

  .bg-gradient-miku {
    @apply bg-gradient-to-br from-miku-primary to-miku-primary-light;
  }
}
```

- [ ] **Step 5：添加全局 body 背景过渡**

更新 `@layer base` 中的 body：

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground transition-colors duration-300;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 6：验证 CSS 无语法错误**

Run: `npx tsc --noEmit`
Expected: 无 CSS 相关错误

- [ ] **Step 7：提交**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
feat: add Miku Space design tokens and glassmorphism utilities

- Custom color palette (miku-primary, miku-pink, dark/light modes)
- Glassmorphism utility classes (.glass, .glass-light, .glass-hover)
- Gradient utilities (.text-gradient, .bg-gradient-miku)
- Dual-mode CSS variables for dark/light themes
EOF
)"
```

---

## Task 2：更新根布局（加载 Outfit 字体）

**Files:**
- Modify: `app/layout.tsx`

**上下文：** 当前使用 Inter 字体。需要替换为 Outfit，并更新站点 metadata。

- [ ] **Step 1：替换字体导入和配置**

将 `app/layout.tsx` 完整替换为：

```tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Miku Space",
  description: "A dreamy personal space inspired by Hatsune Miku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2：更新 globals.css 字体变量映射**

在 `app/globals.css` 的 `@theme inline` 中更新字体变量：

```css
--font-sans: var(--font-outfit), "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

- [ ] **Step 3：验证字体加载**

Run: `npm run dev`
打开浏览器访问 `http://localhost:3000`
检查：页面字体应为 Outfit（英文部分）

- [ ] **Step 4：提交**

```bash
git add app/layout.tsx app/globals.css
git commit -m "$(cat <<'EOF'
feat: load Outfit font and update site metadata

- Replace Inter with Outfit font
- Update title/description to Miku Space
- Configure font-sans variable in Tailwind theme
EOF
)"
```

---

## Task 3：创建通用按钮组件

**Files:**
- Create: `components/ui/Button.tsx`

**上下文：** 当前项目中没有通用的按钮组件（之前的 button.tsx 已删除）。需要创建一个支持 4 种变体的按钮。

- [ ] **Step 1：安装依赖（如需要）**

检查 class-variance-authority 是否已安装：
Run: `npm list class-variance-authority`
如果未安装：
Run: `npm install class-variance-authority`

- [ ] **Step 2：编写按钮组件**

创建 `components/ui/Button.tsx`：

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-miku-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-miku-primary text-dark-base shadow-[0_2px_12px_rgba(168,230,225,0.3)] hover:bg-miku-primary-dark hover:shadow-[0_4px_20px_rgba(168,230,225,0.4)] active:scale-[0.98]",
        secondary:
          "bg-[rgba(168,230,225,0.12)] text-foreground border-[1.5px] border-[rgba(168,230,225,0.35)] hover:bg-[rgba(168,230,225,0.2)] active:scale-[0.98]",
        glass:
          "bg-[rgba(255,255,255,0.1)] backdrop-blur-md text-foreground border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-[0.98]",
        gradient:
          "bg-gradient-to-r from-miku-primary to-miku-primary-light text-dark-base rounded-full shadow-[0_2px_16px_rgba(168,230,225,0.25)] hover:shadow-[0_4px_24px_rgba(168,230,225,0.35)] hover:-translate-y-0.5 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 3：验证组件无类型错误**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：提交**

```bash
git add components/ui/Button.tsx
git commit -m "$(cat <<'EOF'
feat: add Button component with 4 variants

- primary: miku teal with shadow
- secondary: translucent with border
- glass: frosted glass effect
- gradient: pill-shaped gradient
- 3 sizes: sm, md, lg, icon
EOF
)"
```

---

## Task 4：重构导航栏（Navbar）

**Files:**
- Modify: `components/layout/Navbar.tsx`

**上下文：** 当前导航栏为标准白色背景 + 汉堡菜单。需要改为毛玻璃悬浮 + 渐变小方块 Logo + SVG 图标。

- [ ] **Step 1：重写 Navbar 组件**

将 `components/layout/Navbar.tsx` 完整替换为：

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu, X, Music } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <nav className="flex h-13 items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] px-5 shadow-[0_4px_24px_rgba(168,230,225,0.08)] transition-all duration-300 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-miku-primary to-miku-primary-light shadow-[0_2px_8px_rgba(168,230,225,0.3)]">
            <Music className="h-4 w-4 text-dark-base" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Miku Space
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === link.href
                  ? "text-miku-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.1)]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-miku-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
            aria-label="搜索"
          >
            <Search className="h-4 w-4" strokeWidth={2} />
          </Link>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground transition-all hover:bg-[rgba(168,230,225,0.2)] hover:text-miku-primary-dark"
            aria-label="切换主题"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(168,230,225,0.1)] border border-[rgba(168,230,225,0.15)] text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl bg-[rgba(255,255,255,0.65)] backdrop-blur-2xl border border-[rgba(168,230,225,0.25)] p-3 shadow-[0_4px_24px_rgba(168,230,225,0.12)] dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-miku-primary bg-[rgba(168,230,225,0.1)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(168,230,225,0.05)]"
              )}
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

- [ ] **Step 2：修复 nav 背景类的冲突**

上面代码中 nav 的 className 有重复的 bg-/border- 定义。修正为：

```tsx
<nav className={cn(
  "flex h-13 items-center justify-between rounded-2xl backdrop-blur-2xl px-5 shadow-[0_4px_24px_rgba(168,230,225,0.08)] transition-all duration-300",
  "bg-[rgba(255,255,255,0.65)] border border-[rgba(168,230,225,0.25)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
)}>
```

- [ ] **Step 3：验证组件无类型错误**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：视觉验证**

Run: `npm run dev`
打开浏览器访问 `http://localhost:3000`
检查：
- 导航栏为毛玻璃效果，悬浮在顶部
- Logo 为渐变小方块 + Music 图标
- 当前页面链接有主题色下划线
- 搜索和主题切换按钮有半透明底色
- 移动端汉堡菜单正常展开

- [ ] **Step 5：提交**

```bash
git add components/layout/Navbar.tsx
git commit -m "$(cat <<'EOF'
feat: redesign Navbar with glassmorphism and Miku theme

- Glassmorphism floating nav with backdrop blur
- Gradient logo block with Music icon
- Active link indicator with underline dot
- Theme toggle with sun/moon animation
- Mobile responsive hamburger menu
EOF
)"
```

---

## Task 5：重构页脚（Footer）

**Files:**
- Modify: `components/layout/Footer.tsx`

**上下文：** 当前页脚为标准白色背景 + 文字链接。需要改为毛玻璃风格 + 居中布局。

- [ ] **Step 1：重写 Footer 组件**

将 `components/layout/Footer.tsx` 完整替换为：

```tsx
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-7xl px-4 pb-6">
      <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] px-6 py-5 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.5)] border-[rgba(168,230,225,0.2)]">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-miku-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>&copy; {year} Miku Space.</span>
            <span className="hidden sm:inline">Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-miku-pink fill-miku-pink" />
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2：修正 className 冲突**

同上，外层 div 的 className 有重复定义，修正为：

```tsx
<div className={cn(
  "rounded-2xl backdrop-blur-xl px-6 py-5",
  "bg-[rgba(255,255,255,0.5)] border border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
)}>
```

需要导入 `cn`：
```tsx
import { cn } from "@/lib/utils";
```

- [ ] **Step 3：验证组件无类型错误**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4：视觉验证**

Run: `npm run dev`
检查：
- 页脚为毛玻璃卡片
- 导航链接 hover 变主题色
- 版权信息含粉色心形图标
- 移动端布局正常

- [ ] **Step 5：提交**

```bash
git add components/layout/Footer.tsx
git commit -m "$(cat <<'EOF'
feat: redesign Footer with glassmorphism card

- Glassmorphism card container
- Nav links with hover color transition
- Copyright with pink heart icon
- Responsive layout
EOF
)"
```

---

## Task 6：更新站点布局

**Files:**
- Modify: `app/(site)/layout.tsx`

**上下文：** 当前布局为 flex 列布局。需要调整背景色和间距以适配新设计。

- [ ] **Step 1：更新站点布局**

将 `app/(site)/layout.tsx` 替换为：

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-light-base dark:bg-dark-base transition-colors duration-500">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2：视觉验证整体布局**

Run: `npm run dev`
检查：
- 页面背景为淡粉底（浅色模式）或深紫黑底（深色模式）
- 导航栏悬浮在顶部，与内容有间距
- 内容区域有合适的最大宽度
- 页脚在底部

- [ ] **Step 3：提交**

```bash
git add app/(site)/layout.tsx
git commit -m "$(cat <<'EOF'
feat: update site layout with themed background

- Add light/dark background colors
- Center content with max-width container
- Consistent padding and spacing
EOF
)"
```

---

## Task 7：里程碑 1 综合验证

- [ ] **Step 1：运行完整类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 2：运行开发服务器并全面检查**

Run: `npm run dev`
浏览器检查清单：
- [ ] 浅色模式：背景为淡粉色 `#FFF5F7`
- [ ] 深色模式：背景为深紫黑 `#0D0D1A`
- [ ] 导航栏：毛玻璃效果、渐变 Logo、SVG 图标
- [ ] 按钮（在任意页面临时测试）：4 种变体样式正确
- [ ] 页脚：毛玻璃卡片、链接 hover 效果
- [ ] 字体：英文为 Outfit
- [ ] 主题切换：明暗切换平滑
- [ ] 移动端：汉堡菜单正常

- [ ] **Step 3：创建验证截图（可选）**

如使用视觉伴侣，推送验证页面。

- [ ] **Step 4：最终提交**

```bash
git log --oneline -5
```
Expected: 看到 6 个相关 commit

---

## 自我审查

### Spec 覆盖检查

| 设计文档要求 | 对应任务 |
|-------------|---------|
| 色彩系统（双模式） | Task 1 |
| 字体 Outfit | Task 2 |
| 圆角体系 | Task 1（--radius: 0.75rem = 12px 基础） |
| 阴影与光效 | Task 1（glass-hover utilities） |
| 图标风格（SVG） | Task 4（lucide-react icons） |
| 导航栏（毛玻璃） | Task 4 |
| 页脚（毛玻璃） | Task 5 |
| 按钮风格（4 种） | Task 3 |

### Placeholder 扫描

- [x] 无 "TBD"/"TODO"
- [x] 无 "Add appropriate error handling" 等模糊描述
- [x] 无 "Similar to Task N"
- [x] 每个代码步骤都有完整代码

### 类型一致性检查

- [x] ButtonProps 使用标准 HTMLButtonElement
- [x] cn() 工具来自 @/lib/utils，已在所有组件中导入
- [x] Tailwind v4 自定义颜色前缀为 `miku-`，使用一致
- [x] 深色模式类名使用 `dark:` 前缀，与 next-themes 的 `attribute="class"` 一致
