# 个人博客项目 — 阶段二：布局系统与首页积木

> **对应提交**：`da2ef9e` → `cdae7a6` → `f612752`  
> **新增内容**：Navbar 导航栏、Footer 页脚、站点路由分组布局、HeroSection 主页头图  
> **新增知识点**：路由分组、`"use client"`、React Hooks、Framer Motion 动画、响应式设计

---

## 目录

1. [新增文件一览](#1-新增文件一览)
2. [里程碑3续：全局布局系统](#2-里程碑3续全局布局系统)
   - 2.1 路由分组 `(site)`
   - 2.2 Navbar 导航栏
   - 2.3 Footer 页脚
   - 2.4 站点布局组件
3. [里程碑4：HeroSection 主页头图](#3-里程碑4herosection-主页头图)
   - 3.1 Framer Motion 动画原理
   - 3.2 响应式设计
4. [新增知识点详解](#4-新增知识点详解)
   - 4.1 `"use client"` 指令
   - 4.2 React `useState` Hook
   - 4.3 Next.js `Link` 组件
   - 4.4 响应式断点
5. [当前项目完整结构](#5-当前项目完整结构)
6. [页面渲染流程](#6-页面渲染流程)
7. [知识检查清单](#7-知识检查清单)

---

## 1. 新增文件一览

| 文件 | 类型 | 作用 |
|------|------|------|
| `app/(site)/layout.tsx` | 布局组件 | 前台站点的共享布局（Navbar + Footer + 主内容区） |
| `app/(site)/page.tsx` | 页面组件 | 前台首页，展示 HeroSection |
| `components/layout/Navbar.tsx` | 布局组件 | 顶部导航栏（含响应式移动端菜单） |
| `components/layout/Footer.tsx` | 布局组件 | 底部页脚（版权信息） |
| `components/blocks/HeroSection.tsx` | 业务组件 | 主页头图/自我介绍板块（带动画） |

**被移除的文件：**
- `app/page.tsx` — 旧的首页（Next.js 默认欢迎页），被移动到 `app/(site)/page.tsx`

---

## 2. 里程碑3续：全局布局系统

### 2.1 路由分组 `(site)` — `app/(site)/`

这是 Next.js App Router 的**路由分组（Route Group）**特性。

**什么是路由分组？**

在 App Router 中，文件夹名用括号包裹 `(folderName)` 时，这个文件夹**不会出现在 URL 路径中**，但可以共享一个 `layout.tsx`。

**为什么要分组？**

因为你的项目有两套界面：

| 分组 | URL 前缀 | 用途 | 布局特点 |
|------|----------|------|----------|
| `(site)` | 无前缀（`/`、`/about`、`/works`） | 前台站点（游客可见） | 有 Navbar + Footer |
| `(admin)` | `/admin/*` | 管理后台（需登录） | 有 AdminNavbar，无 Footer |

**目录结构变化：**

```
app/
├── layout.tsx              # 根布局（所有页面共享：字体、全局样式、元数据）
│
├── (site)/                 # 路由分组 — 前台站点
│   ├── layout.tsx          # 站点布局（Navbar + Footer + 主内容区）
│   ├── page.tsx            # 首页 → URL: /
│   ├── about/
│   │   └── page.tsx        # 关于页 → URL: /about
│   ├── works/
│   │   └── page.tsx        # 作品页 → URL: /works
│   └── ...
│
└── (admin)/                # 路由分组 — 管理后台（尚未创建）
    └── admin/
        ├── layout.tsx      # 后台布局
        ├── page.tsx        # 后台仪表板 → URL: /admin
        └── login/
            └── page.tsx    # 登录页 → URL: /admin/login
```

**关键点：**
- `(site)` 文件夹本身不会在 URL 中出现。`app/(site)/page.tsx` 对应的就是 `/`
- `(site)/layout.tsx` 只包裹 `(site)` 分组内的页面，不影响 `(admin)` 分组
- 布局可以**嵌套**：根布局 → 分组布局 → 页面内容

**布局嵌套关系：**

```
<!-- 根布局 (app/layout.tsx) -->
<html lang="zh-CN">
  <body className={inter.className}>
    
    <!-- 站点布局 (app/(site)/layout.tsx) -->
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        
        <!-- 页面内容 (app/(site)/page.tsx) -->
        <div>
          <HeroSection />
        </div>
        
      </main>
      <Footer />
    </div>
    
  </body>
</html>
```

---

### 2.2 Navbar 导航栏 — `components/layout/Navbar.tsx`

**文件位置：** `components/layout/Navbar.tsx`

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

        {/* 桌面端导航 */}
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

        {/* 移动端菜单按钮 */}
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

      {/* 移动端下拉菜单 */}
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

#### 逐段解析

**第1行：`"use client"`**

这是 Next.js 的**客户端组件指令**。加了这一行，说明这个组件需要在浏览器端运行，可以使用 React Hooks（如 `useState`）、浏览器 API（如 `window`）和事件处理。

> 如果不加 `"use client"`，默认是 **Server Component**，只能在服务端运行，不能使用 Hooks。

**导航数据数组：**

```tsx
const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/notes", label: "笔记" },
  { href: "/posts", label: "文章" },
  { href: "/about", label: "关于" },
];
```

把导航链接抽成数组，然后用 `.map()` 渲染，代码更简洁，以后增删链接只需改数组。

**桌面端导航栏：**

```tsx
<nav className="hidden md:flex items-center gap-6 text-sm font-medium">
```

- `hidden` — 默认隐藏（在移动端）
- `md:flex` — 在 `md`（中等屏幕，768px 以上）断点时显示为 flex 布局
- `gap-6` — 子元素之间间距 1.5rem（24px）

**链接样式：**

```tsx
className="transition-colors hover:text-foreground/80 text-foreground/60"
```

- `text-foreground/60` — 文字颜色使用 `--foreground` 变量的 60% 不透明度（较淡）
- `hover:text-foreground/80` — 鼠标悬停时变为 80% 不透明度（稍深）
- `transition-colors` — 颜色变化时有过渡动画

**移动端菜单按钮：**

```tsx
<button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
```

- `md:hidden` — 在中等屏幕以上隐藏（只在移动端显示）
- `onClick` — 点击时切换 `mobileOpen` 状态

**SVG 图标切换：**

```tsx
{mobileOpen ? (
  <!-- 关闭图标（X） -->
  <path d="M6 18L18 6M6 6l12 12" />
) : (
  <!-- 汉堡菜单图标（三条线） -->
  <path d="M4 6h16M4 12h16M4 18h16" />
)}
```

用条件渲染实现图标切换：菜单关闭时显示三条横线，打开时显示 X。

**移动端下拉菜单：**

```tsx
{mobileOpen && (
  <div className="md:hidden border-t px-4 py-3 space-y-2">...</div>
)}
```

- `{mobileOpen && (...)}` — 条件渲染。只有当 `mobileOpen` 为 `true` 时才渲染下拉菜单
- `onClick={() => setMobileOpen(false)}` — 点击链接后自动关闭菜单

**固定定位与毛玻璃效果：**

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
```

- `sticky top-0` — 粘性定位，滚动时固定在顶部
- `z-50` — 层级很高，确保导航栏在其他内容之上
- `bg-background/95` — 背景色 95% 不透明度（略微透明）
- `backdrop-blur` — 毛玻璃效果，让背后的内容模糊
- `supports-[backdrop-filter]:bg-background/60` — 如果浏览器支持 `backdrop-filter`，背景更不透明（60%）

---

### 2.3 Footer 页脚 — `components/layout/Footer.tsx`

**文件位置：** `components/layout/Footer.tsx`

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

这是一个非常简单的页脚组件，没有使用 `"use client"`，说明它是一个 **Server Component**。

**为什么 Footer 可以是 Server Component？**

因为它：
- 不需要用户交互（没有 onClick、onChange）
- 不需要浏览器 API
- 不需要 React Hooks
- `new Date().getFullYear()` 在服务端执行也可以（服务端也有当前时间）

**响应式布局：**

```tsx
<div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
```

- 移动端：`flex-col` 垂直排列，`items-center` 水平居中
- 桌面端（`md:`）：`flex-row` 水平排列，`h-14` 固定高度

**动态年份：**

```tsx
&copy; {new Date().getFullYear()} My Blog. All rights reserved.
```

- `&copy;` — HTML 实体，渲染为 © 符号
- `{new Date().getFullYear()}` — JS 表达式，渲染为当前年份（如 2026）
- 每年自动更新，无需手动修改代码

---

### 2.4 站点布局 — `app/(site)/layout.tsx`

**文件位置：** `app/(site)/layout.tsx`

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

**布局结构：**

```
<div className="flex min-h-screen flex-col">     ← 外层容器：flex 纵向排列，至少占满一屏
  <Navbar />                                   ← 顶部导航栏
  <main className="flex-1">                     ← 主内容区：flex-1 自动占满剩余空间
    {children}                                  ← 具体页面内容
  </main>
  <Footer />                                   ← 底部页脚
</div>
```

**关键 CSS：**

| 类名 | 作用 |
|------|------|
| `flex` | 启用 flex 布局 |
| `min-h-screen` | 最小高度 100vh（占满整个视口） |
| `flex-col` | 子元素纵向排列（从上往下） |
| `flex-1` | 自动占满剩余空间。这样即使内容很少，main 也会撑开，把 Footer 推到底部 |

**为什么 Footer 总是在底部？**

因为 `main` 有 `flex-1`，它会自动拉伸占满 `Navbar` 和 `Footer` 之间的所有空间。即使页面内容很少，`Footer` 也会被推到屏幕底部。

```
┌─────────────────────┐
│      Navbar         │  ← h-14（固定高度）
├─────────────────────┤
│                     │
│                     │
│       main          │  ← flex-1（占满剩余空间）
│   （页面内容）       │
│                     │
├─────────────────────┤
│      Footer         │  ← 始终在底部
└─────────────────────┘
```

---

## 3. 里程碑4：HeroSection 主页头图

### 3.1 组件代码 — `components/blocks/HeroSection.tsx`

**文件位置：** `components/blocks/HeroSection.tsx`

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
          <a href="/works" className="...">查看作品</a>
          <a href="/about" className="...">了解更多</a>
        </div>
      </motion.div>
    </section>
  );
}
```

#### 为什么加 `"use client"`？

因为使用了 `framer-motion` 的 `motion.div` 组件。Framer Motion 需要在浏览器端运行，访问 DOM 和浏览器动画 API，所以必须是 Client Component。

#### `container` 类名的作用

```tsx
<section className="container py-16 md:py-24">
```

`container` 是 Tailwind 的一个工具类，它会：
- 设置一个最大宽度（默认 1280px）
- 水平居中（`margin-left: auto; margin-right: auto`）
- 左右有 padding（在小屏幕上防止内容贴边）

这样内容不会铺满整个超宽屏幕，保持合适的阅读宽度。

#### 头像区域

```tsx
<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl">
  👋
</div>
```

- `w-24 h-24` — 宽度和高度 6rem（96px）
- `rounded-full` — 完全圆角（圆形）
- `bg-muted` — 使用主题中的 muted 背景色（浅灰色）
- `flex items-center justify-center` — 水平和垂直居中
- `text-4xl` — 文字大小 2.25rem（36px）

#### 标题中的高亮

```tsx
<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
  你好，我是 <span className="text-primary">博主</span>
</h1>
```

- `text-3xl md:text-5xl` — 移动端 30px，桌面端 48px
- `tracking-tight` — 字母间距收紧
- `text-primary` — 使用主题主色（亮模式下是黑色，暗模式下是白色）

---

### 3.2 Framer Motion 动画原理

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}      ← 初始状态：透明，向下偏移 20px
  animate={{ opacity: 1, y: 0 }}       ← 目标状态：完全不透明，回到原位
  transition={{ duration: 0.5 }}       ← 过渡时长 0.5 秒
>
```

**Framer Motion 的核心概念：**

| 属性 | 作用 |
|------|------|
| `initial` | 组件首次渲染时的初始状态 |
| `animate` | 组件要达到的目标状态 |
| `transition` | 从 `initial` 到 `animate` 的过渡方式 |

**这个动画的效果：**

页面加载时，HeroSection 内容会：
1. 初始状态：`opacity: 0`（完全透明）+ `y: 20`（向下偏移 20 像素）
2. 动画到：`opacity: 1`（完全可见）+ `y: 0`（回到原位）
3. 过渡时长：0.5 秒

简单说就是：**内容从下方淡入**。

**Framer Motion 的优势：**

- **声明式**：你只需要描述"从哪里到哪里"，不用写复杂的 CSS @keyframes
- **自动处理**：自动计算中间帧、缓动函数、浏览器兼容性
- **性能优化**：使用 GPU 加速的 `transform` 和 `opacity`，不会触发重排

---

### 3.3 响应式设计

```tsx
<section className="container py-16 md:py-24">
```

| 类名 | 移动端（< 768px） | 桌面端（≥ 768px） |
|------|------------------|------------------|
| `py-16` | padding-top/bottom: 4rem | — |
| `md:py-24` | — | padding-top/bottom: 6rem |

**Tailwind 的响应式断点：**

| 断点前缀 | 最小宽度 | 典型设备 |
|----------|----------|----------|
| （无前缀） | 0px | 所有设备 |
| `sm:` | 640px | 大手机 |
| `md:` | 768px | 平板 |
| `lg:` | 1024px | 笔记本 |
| `xl:` | 1280px | 桌面显示器 |
| `2xl:` | 1536px | 大屏显示器 |

**设计原则：移动优先（Mobile First）**

Tailwind 的类名默认应用于所有屏幕尺寸，带前缀的类名（如 `md:py-24`）只在对应断点及以上生效。

```
<div className="text-sm md:text-lg">
  在所有屏幕上：text-sm（14px）
  在 md 及以上：text-lg（18px）
</div>
```

---

## 4. 新增知识点详解

### 4.1 `"use client"` 指令

在 Next.js App Router 中，组件默认是 **Server Component（服务端组件）**。如果组件需要使用以下功能，必须添加 `"use client"`：

- React Hooks（`useState`、`useEffect`、`useContext` 等）
- 浏览器 API（`window`、`document`、`localStorage` 等）
- 事件处理（`onClick`、`onChange`、`onSubmit` 等）
- 第三方客户端库（Framer Motion、React Hook Form 等）

**Server Component vs Client Component 对比：**

| 特性 | Server Component | Client Component |
|------|-----------------|------------------|
| `"use client"` | 不需要 | **必须加** |
| 运行位置 | 服务端（Node.js） | 浏览器 |
| 可以访问数据库 | ✅ 可以直接 `import { prisma }` | ❌ 需要通过 API |
| 可以使用 Hooks | ❌ | ✅ |
| 可以使用事件处理 | ❌ | ✅ |
| 首屏加载 | 更快（HTML 直接输出） | 需要 hydrate |
| SEO 友好 | ✅ | 需要 SSR |
| 包体积 | 不发送到浏览器 | 会发送到浏览器 |

**最佳实践：**

尽可能把代码写成 Server Component，只在必要时用 `"use client"`：

```
页面（Server Component）
  ├── 从数据库获取数据 ✅
  ├── 把数据传给子组件
  └── Client Component（"use client"）
        ├── 处理交互（点击、表单）
        ├── 使用 useState/useEffect
        └── 渲染 UI
```

你的项目就是按照这个模式：
- `app/(site)/page.tsx` — Server Component，可以后续直接查数据库
- `components/blocks/HeroSection.tsx` — Client Component（因为用了 framer-motion）

### 4.2 React `useState` Hook

```tsx
const [mobileOpen, setMobileOpen] = useState(false);
```

**什么是 Hook？**

Hook 是 React 16.8 引入的特性，让函数组件也能拥有状态（state）和生命周期功能。

**`useState` 的用法：**

```tsx
const [状态值, 设置状态的函数] = useState(初始值);
```

**在你的 Navbar 中：**

```tsx
const [mobileOpen, setMobileOpen] = useState(false);
```

| 变量 | 含义 |
|------|------|
| `mobileOpen` | 当前状态值，`false` 表示移动端菜单关闭 |
| `setMobileOpen` | 修改状态的函数 |
| `useState(false)` | 初始值为 `false` |

**状态更新触发重新渲染：**

```tsx
<button onClick={() => setMobileOpen(!mobileOpen)}>
```

当点击按钮时：
1. `setMobileOpen(!false)` → `setMobileOpen(true)`
2. React 检测到状态变化
3. 重新渲染组件（执行函数体）
4. `mobileOpen` 现在是 `true`
5. 条件渲染 `{mobileOpen && (...)}` 变为真，显示下拉菜单

### 4.3 Next.js `Link` 组件

```tsx
import Link from "next/link";

<Link href="/" className="font-bold text-lg">
  My Blog
</Link>
```

**为什么要用 `Link` 而不是 `<a>`？**

| 特性 | `<a>` 标签 | `next/link` |
|------|-----------|-------------|
| 页面跳转 | 整页刷新 | **客户端导航**（无刷新） |
| 性能 | 重新下载所有资源 | 只加载变化的代码 |
| 用户体验 | 白屏闪烁 | 流畅过渡 |
| SEO | ✅ | ✅ |
| 外部链接 | ✅ | 用 `<a>` |

**使用场景：**

```tsx
// 内部导航 — 用 Link（客户端路由，无刷新）
<Link href="/about">关于</Link>

// 外部链接 — 用普通 a 标签
<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
```

在你的 HeroSection 中，按钮用的是 `<a>` 而不是 `Link`：

```tsx
<a href="/works" className="...">查看作品</a>
```

这里可以用 `Link` 替换以获得更好的客户端导航体验。不过 `<a>` 也能工作，只是会整页刷新。

### 4.4 响应式断点速查

```tsx
// Navbar 中的响应式设计
<nav className="hidden md:flex ...">           ← 桌面端显示，移动端隐藏
<button className="md:hidden ...">            ← 移动端显示，桌面端隐藏
```

| 写法 | 含义 |
|------|------|
| `hidden` | 默认隐藏 |
| `md:flex` | md（768px+）时显示为 flex |
| `md:hidden` | md（768px+）时隐藏 |
| `flex md:hidden` | 默认显示，md 时隐藏 |

---

## 5. 当前项目完整结构

```
E:/code/zsxy/
├── app/
│   ├── globals.css               # 全局 CSS + Tailwind 主题变量
│   ├── layout.tsx                # 根布局（字体、元数据、全局结构）
│   │
│   └── (site)/                   # 路由分组 — 前台站点
│       ├── layout.tsx            # 站点布局（Navbar + Footer + 主内容区）
│       └── page.tsx              # 首页 → URL: /
│
├── components/
│   ├── blocks/
│   │   └── HeroSection.tsx       # 主页头图板块（带动画）
│   ├── layout/
│   │   ├── Navbar.tsx            # 顶部导航栏（响应式 + 移动端菜单）
│   │   └── Footer.tsx            # 底部页脚
│   └── ui/
│       └── button.tsx            # shadcn/ui Button 组件
│
├── lib/
│   ├── prisma.ts                 # Prisma Client 单例实例
│   └── utils.ts                  # cn() 工具函数
│
├── prisma/
│   ├── schema.prisma             # 数据库模型定义
│   └── migrations/               # 数据库迁移历史
│
├── public/                       # 静态资源
├── docs/
│   └── learning-guide/
│       ├── project-overview.md   # 阶段一学习指南
│       └── phase-02-layout-and-hero.md  # 本文档
│
├── .env                          # 环境变量
├── dev.db                        # SQLite 数据库文件
└── package.json                  # 项目依赖
```

---

## 6. 页面渲染流程

现在访问 `http://localhost:3000/` 时，页面是如何渲染出来的？

```
用户请求 /
    ↓
Next.js 路由系统匹配到 app/(site)/page.tsx
    ↓
包装在 app/(site)/layout.tsx 中（加入 Navbar + Footer）
    ↓
再包装在 app/layout.tsx 中（加入字体、全局样式）
    ↓
生成完整 HTML：

<html>
  <head>
    <title>My Blog</title>
    <style>...Tailwind CSS...</style>
  </head>
  <body>
    <div class="flex min-h-screen flex-col">
      <header>...Navbar（含移动端菜单状态）...</header>
      <main class="flex-1">
        <section>...HeroSection（带动画）...</section>
      </main>
      <footer>...Footer...</footer>
    </div>
    <script>...React + Framer Motion...</script>
  </body>
</html>

    ↓
发送给浏览器显示
    ↓
浏览器加载 JS，React "hydrate"（激活交互）：
  - 移动端菜单按钮可以点击了
  - Framer Motion 动画开始播放
```

---

## 7. 知识检查清单

学习完本文档后，你应该能回答以下问题：

**路由与布局**
- [ ] 什么是路由分组 `(site)`？它有什么好处？
- [ ] 布局是如何嵌套的？`app/layout.tsx` 和 `app/(site)/layout.tsx` 的关系是什么？
- [ ] 为什么 Footer 总是在页面底部？`flex-1` 的作用是什么？

**组件类型**
- [ ] 什么时候需要加 `"use client"`？
- [ ] Server Component 和 Client Component 有什么区别？
- [ ] 为什么 Navbar 需要 `"use client"`，而 Footer 不需要？

**React 基础**
- [ ] `useState` 的返回值是什么？如何更新状态？
- [ ] 状态更新后会发生什么？
- [ ] `{mobileOpen && (...)}` 是什么语法？

**Next.js**
- [ ] `Link` 组件和 `<a>` 标签有什么区别？
- [ ] 什么时候用 `Link`，什么时候用 `<a>`？

**Tailwind CSS**
- [ ] `hidden md:flex` 是什么意思？
- [ ] 什么是移动优先（Mobile First）设计？
- [ ] `container` 类名的作用是什么？

**Framer Motion**
- [ ] `initial`、`animate`、`transition` 分别控制什么？
- [ ] 你的 HeroSection 动画效果是什么？

---

> **文档版本**：v1.0  
> **对应代码版本**：commit `f612752`（feat: add HeroSection block）  
> **编写日期**：2026-05-25
