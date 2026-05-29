# 里程碑 4：列表页 + 详情页 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一作品/文章/笔记的列表页和详情页风格，全部升级为毛玻璃卡片设计，并定制 Markdown 正文样式以匹配 Miku Space 主题。

**Architecture:** 复用并升级现有的 `ContentCard` 和 `ContentDetail` 组件。列表页添加毛玻璃标题栏和统一的响应式网格/列表布局。详情页采用"封面图 + 毛玻璃标题区 + 定制 Markdown"的三段式结构。Markdown 样式通过 Tailwind Typography 插件的自定义配置实现。

**Tech Stack:** Next.js 16, Tailwind CSS v4, TypeScript, react-markdown, remark-gfm, Framer Motion

---

## 文件结构映射

| 文件 | 操作 | 职责 |
|------|------|------|
| `components/site/ContentCard.tsx` | 重写 | 统一内容卡片（毛玻璃 + 封面 + 标签 + 日期） |
| `components/site/ContentDetail.tsx` | 重写 | 统一详情页布局（封面 + 标题区 + Markdown） |
| `app/(site)/works/page.tsx` | 修改 | 作品列表页（3 列网格） |
| `app/(site)/posts/page.tsx` | 修改 | 文章列表页（纵向列表） |
| `app/(site)/notes/page.tsx` | 修改 | 笔记列表页（纵向列表 + 分类标签） |
| `app/(site)/works/[slug]/page.tsx` | 修改 | 作品详情页（适配新 ContentDetail） |
| `app/(site)/posts/[slug]/page.tsx` | 修改 | 文章详情页（适配新 ContentDetail） |
| `app/(site)/notes/[slug]/page.tsx` | 修改 | 笔记详情页（适配新 ContentDetail） |
| `app/globals.css` | 修改 | 定制 Markdown / prose 样式 |

---

## 已有的设计系统上下文

**颜色：**
- `miku-primary` (#A8E6E1), `miku-primary-light`, `miku-primary-dark`, `miku-pink`
- `text-foreground`, `text-muted-foreground`

**毛玻璃卡片：**
```tsx
cn("rounded-3xl backdrop-blur-xl border",
   "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
   "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]")
```

**当前列表页布局：**
- 作品：3 列网格 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 文章/笔记：纵向列表 `space-y-4`

**当前 ContentCard 接口：**
```tsx
interface ContentItem {
  id: string; title: string; slug: string;
  excerpt?: string | null; description?: string | null;
  coverUrl?: string | null; category?: string | null;
  createdAt: Date;
}
```

**当前 ContentDetail 接口：**
```tsx
interface ContentDetailProps {
  title: string; content: string;
  coverUrl?: string | null; excerpt?: string | null;
  backHref: string; backLabel: string;
  meta?: React.ReactNode; extra?: React.ReactNode;
}
```

---

## Task 1：重写 ContentCard 组件

**Files:**
- Rewrite: `components/site/ContentCard.tsx`

**上下文：** 当前 ContentCard 使用普通边框卡片，需要升级为毛玻璃风格。支持三种模式：作品（带封面图的网格卡片）、文章（带摘要的列表卡片）、笔记（带分类标签的列表卡片）。

**设计规格：**
- 外层：毛玻璃卡片，圆角 20px，padding 0（图片区域无边距）或 20px（纯文本）
- 封面图：顶部全宽，圆角 20px（与卡片一致），aspect-video 比例，object-cover
- 无封面图时：显示渐变占位 `bg-gradient-to-br from-miku-primary to-miku-primary-light` + 图标
- 内容区 padding：20px
- 标题：16px font-semibold text-foreground，hover 变 miku-primary
- 摘要：14px text-muted-foreground，2 行截断 `line-clamp-2`
- 分类标签：11px，pill 形状
  - 笔记分类：`bg-[rgba(245,198,208,0.15)] text-miku-pink`
- 日期：11px text-muted-foreground，格式 `YYYY.MM.DD`
- 底部元信息区：flex，gap-2，与内容区有 mt-3 间距
- Hover：卡片 `hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]`
- 过渡：`transition-all duration-300`

**接口保持不变，但新增 `variant` 属性：**
```tsx
type CardVariant = "grid" | "list";

interface ContentCardProps {
  item: ContentItem;
  href: string;
  variant?: CardVariant;
  showExcerpt?: boolean;
  showCategory?: boolean;
  aspectVideo?: boolean;
}
```

- `variant="grid"`：用于作品页，有封面图，整体为卡片
- `variant="list"`：用于文章/笔记页，横向布局，左侧缩略图（80px）+ 右侧信息

- [ ] **Step 1：重写 ContentCard 组件**

```tsx
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  category?: string | null;
  createdAt: Date;
}

interface ContentCardProps {
  item: ContentItem;
  href: string;
  variant?: "grid" | "list";
  showExcerpt?: boolean;
  showCategory?: boolean;
  aspectVideo?: boolean;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function ContentCard({
  item,
  href,
  variant = "grid",
  showExcerpt = true,
  showCategory = false,
  aspectVideo = false,
}: ContentCardProps) {
  if (variant === "list") {
    return (
      <Link href={href} className="group block">
        <div
          className={cn(
            "flex gap-4 rounded-2xl p-4 backdrop-blur-xl border",
            "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
            "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
          )}
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-miku-primary to-miku-primary-light">
            {item.coverUrl ? (
              <Image
                src={item.coverUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl opacity-60">📝</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground group-hover:text-miku-primary transition-colors truncate">
              {item.title}
            </h3>
            {showExcerpt && (item.excerpt || item.description) && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.excerpt || item.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {showCategory && item.category && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(245,198,208,0.15)] text-miku-pink">
                  {item.category}
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (works)
  return (
    <Link href={href} className="group block h-full">
      <div
        className={cn(
          "flex flex-col h-full rounded-2xl overflow-hidden backdrop-blur-xl border",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
        )}
      >
        {/* Cover */}
        <div className={cn(
          "relative w-full overflow-hidden bg-gradient-to-br from-miku-primary to-miku-primary-light",
          aspectVideo ? "aspect-video" : "h-40"
        )}>
          {item.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-40">🚀</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-semibold text-foreground group-hover:text-miku-primary transition-colors">
            {item.title}
          </h3>
          {showExcerpt && (item.excerpt || item.description) && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 flex-1">
              {item.excerpt || item.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(item.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/site/ContentCard.tsx
git commit -m "$(cat <<'EOF'
feat: redesign ContentCard with glassmorphism and variant support

- Grid variant for works (cover image + card body)
- List variant for posts/notes (thumbnail + title/excerpt)
- Hover lift + shadow animation
- Category tag with pink accent for notes
- Date with Calendar icon
EOF
)"
```

---

## Task 2：重写 ContentDetail 组件

**Files:**
- Rewrite: `components/site/ContentDetail.tsx`

**上下文：** 当前详情页为标准白色背景文章布局。需要改为毛玻璃风格：可选全宽封面图、毛玻璃标题区、定制 Markdown 样式、上一篇/下一篇导航。

**设计规格：**
- 封面图（可选）：全宽，圆角 24px，max-h-[400px]，object-cover
- 毛玻璃标题区：圆角 24px，padding 28px，包含标题 + 元信息
  - 标题：32px font-bold text-foreground
  - 元信息：flex gap-3，标签 + 日期
- 摘要（可选）：引用块样式，左侧 3px 主题色边框 + 淡色背景
- Markdown 正文区：max-w-3xl 居中，定制 prose 样式
- 底部导航：上一篇/下一篇，毛玻璃卡片

**接口：**
```tsx
interface ContentDetailProps {
  title: string;
  content: string;
  coverUrl?: string | null;
  excerpt?: string | null;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
  extra?: React.ReactNode;
  prev?: { title: string; href: string } | null;
  next?: { title: string; href: string } | null;
}
```

- [ ] **Step 1：重写 ContentDetail 组件**

```tsx
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
}

interface ContentDetailProps {
  title: string;
  content: string;
  coverUrl?: string | null;
  excerpt?: string | null;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
  extra?: React.ReactNode;
  prev?: NavItem | null;
  next?: NavItem | null;
}

export default function ContentDetail({
  title,
  content,
  coverUrl,
  excerpt,
  backHref,
  backLabel,
  meta,
  extra,
  prev,
  next,
}: ContentDetailProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-miku-primary transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {/* Cover image */}
      {coverUrl && (
        <div className="relative w-full h-[200px] md:h-[320px] rounded-3xl overflow-hidden mb-6">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.3)] to-transparent" />
        </div>
      )}

      {/* Title area */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-7 mb-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-2xl md:text-[32px] font-bold text-foreground leading-tight mb-4">
          {title}
        </h1>

        {meta && <div className="flex flex-wrap items-center gap-3">{meta}</div>}
      </div>

      {/* Excerpt */}
      {excerpt && (
        <div
          className={cn(
            "rounded-2xl border-l-[3px] p-5 mb-6",
            "bg-[rgba(168,230,225,0.08)] border-miku-primary"
          )}
        >
          <p className="text-base text-muted-foreground leading-relaxed">{excerpt}</p>
        </div>
      )}

      {/* Extra content (demo/repo buttons for works) */}
      {extra && <div className="mb-6">{extra}</div>}

      {/* Markdown content */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-7 md:p-10",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
          "prose-custom"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {prev ? (
            <Link
              href={prev.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl p-5 backdrop-blur-xl border",
                "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
              )}
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">上一篇</span>
                <span className="text-sm font-medium text-foreground truncate block">{prev.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.href}
              className={cn(
                "flex items-center justify-end gap-3 rounded-2xl p-5 backdrop-blur-xl border text-right",
                "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
              )}
            >
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">下一篇</span>
                <span className="text-sm font-medium text-foreground truncate block">{next.title}</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3：提交**

```bash
git add components/site/ContentDetail.tsx
git commit -m "$(cat <<'EOF'
feat: redesign ContentDetail with glassmorphism layout

- Optional full-width cover image with gradient overlay
- Glassmorphism title area with metadata
- Excerpt block with left accent border
- Prev/Next navigation cards
- Custom prose class for markdown styling
EOF
)"
```

---

## Task 3：定制 Markdown 样式

**Files:**
- Modify: `app/globals.css`

**上下文：** Tailwind Typography 插件已安装（`@plugin "@tailwindcss/typography"`），但默认的 `prose` 样式不适合 Miku Space 主题。需要自定义颜色、间距、引用块、代码块等以匹配设计系统。

**设计规格：**
- 正文：16px，行高 1.8，text-foreground
- 标题：h1 28px bold, h2 22px bold, h3 18px semibold，颜色 text-foreground
- 段落间距：mb-5
- 引用块：左侧 3px `border-miku-primary`，背景 `bg-[rgba(168,230,225,0.06)]`，圆角 12px，padding 16px
- 代码块（行内）：`bg-[rgba(168,230,225,0.12)]`，圆角 6px，padding 2px 6px，文字 `text-miku-primary-dark`
- 代码块（块级）：毛玻璃背景 `bg-[rgba(255,255,255,0.04)]` / `dark:bg-[rgba(0,0,0,0.2)]`，圆角 12px，padding 16px，overflow-x-auto
- 链接：`text-miku-primary-dark hover:underline`
- 列表：disc 标记颜色 `text-miku-primary`
- 表格：边框 `border-[rgba(168,230,225,0.15)]`
- 分割线：`border-[rgba(168,230,225,0.15)]`

**实现方式：** 在 `globals.css` 中添加 `.prose-custom` 工具类，覆盖 typography 的默认变量。

- [ ] **Step 1：在 globals.css 中添加 prose-custom 样式**

在文件末尾（`@layer utilities` 区块之后或内部）添加：

```css
@layer utilities {
  /* ... existing utilities ... */

  .prose-custom {
    @apply text-foreground;
  }

  .prose-custom :where(h1, h2, h3, h4, h5, h6) {
    @apply text-foreground font-bold tracking-tight;
  }

  .prose-custom h1 {
    @apply text-[28px] mb-6 mt-2;
  }

  .prose-custom h2 {
    @apply text-[22px] mb-4 mt-8 pb-2 border-b border-[rgba(168,230,225,0.15)];
  }

  .prose-custom h3 {
    @apply text-lg mb-3 mt-6;
  }

  .prose-custom p {
    @apply text-base leading-[1.8] mb-5;
  }

  .prose-custom a {
    @apply text-miku-primary-dark transition-colors hover:underline;
  }

  .prose-custom blockquote {
    @apply border-l-[3px] border-miku-primary bg-[rgba(168,230,225,0.06)] rounded-xl px-5 py-4 my-6 not-italic;
  }

  .prose-custom blockquote p {
    @apply mb-0;
  }

  .prose-custom ul {
    @apply list-disc pl-6 mb-5 space-y-1.5;
  }

  .prose-custom ol {
    @apply list-decimal pl-6 mb-5 space-y-1.5;
  }

  .prose-custom li {
    @apply text-base leading-relaxed;
  }

  .prose-custom li::marker {
    @apply text-miku-primary;
  }

  .prose-custom code {
    @apply bg-[rgba(168,230,225,0.12)] text-miku-primary-dark rounded-md px-1.5 py-0.5 text-sm font-mono;
  }

  .prose-custom pre {
    @apply bg-[rgba(168,230,225,0.06)] dark:bg-[rgba(0,0,0,0.25)] rounded-xl p-5 my-6 overflow-x-auto border border-[rgba(168,230,225,0.1)];
  }

  .prose-custom pre code {
    @apply bg-transparent text-foreground p-0 text-sm;
  }

  .prose-custom hr {
    @apply border-[rgba(168,230,225,0.15)] my-8;
  }

  .prose-custom table {
    @apply w-full text-sm my-6 border-collapse;
  }

  .prose-custom th,
  .prose-custom td {
    @apply border border-[rgba(168,230,225,0.15)] px-4 py-2.5 text-left;
  }

  .prose-custom th {
    @apply font-semibold bg-[rgba(168,230,225,0.08)] text-foreground;
  }

  .prose-custom img {
    @apply rounded-xl my-6;
  }

  .prose-custom strong {
    @apply text-foreground font-semibold;
  }
}
```

- [ ] **Step 2：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误（CSS 变更不影响 TS）

- [ ] **Step 3：提交**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
feat: add custom prose styles for markdown content

- Headings with tracking-tight and bottom borders
- Blockquotes with miku-primary left accent
- Inline code with teal background
- Code blocks with glassmorphism background
- Links in miku-primary-dark with hover underline
- List markers in theme color
- Tables with subtle borders
EOF
)"
```

---

## Task 4：更新列表页（作品 / 文章 / 笔记）

**Files:**
- Modify: `app/(site)/works/page.tsx`
- Modify: `app/(site)/posts/page.tsx`
- Modify: `app/(site)/notes/page.tsx`

**上下文：** 三个列表页需要统一风格：添加毛玻璃标题栏、使用新的 ContentCard variant。

**设计规格：**
- 页面标题区：毛玻璃卡片，圆角 24px，padding 24px，包含标题 + 简介
  - 标题：28px font-bold
  - 简介：14px text-muted-foreground
- 作品页：3 列网格 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`
- 文章/笔记页：纵向列表 `flex flex-col gap-4`
- 所有列表项使用新的 ContentCard

- [ ] **Step 1：更新作品列表页**

```tsx
import { prisma } from "@/lib/prisma";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">作品展示</h1>
        <p className="text-sm text-muted-foreground mt-1">
          精选项目与实验性作品
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {works.map((work) => (
          <ContentCard
            key={work.id}
            item={work}
            href={`/works/${work.slug}`}
            variant="grid"
            aspectVideo
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2：更新文章列表页**

```tsx
import { prisma } from "@/lib/prisma";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">技术文章</h1>
        <p className="text-sm text-muted-foreground mt-1">
          关于前端开发、设计与技术的思考
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            item={post}
            href={`/posts/${post.slug}`}
            variant="list"
            showExcerpt
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3：更新笔记列表页**

```tsx
import { prisma } from "@/lib/prisma";
import ContentCard from "@/components/site/ContentCard";
import { cn } from "@/lib/utils";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">学习笔记</h1>
        <p className="text-sm text-muted-foreground mt-1">
          零散的知识记录与备忘
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {notes.map((note) => (
          <ContentCard
            key={note.id}
            item={note}
            href={`/notes/${note.slug}`}
            variant="list"
            showCategory
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 5：提交**

```bash
git add app/(site)/works/page.tsx app/(site)/posts/page.tsx app/(site)/notes/page.tsx
git commit -m "$(cat <<'EOF'
feat: update list pages with glassmorphism headers and new ContentCard

- Works: 3-column grid with glass header
- Posts: vertical list with glass header
- Notes: vertical list with category tags
- All use new ContentCard variants
EOF
)"
```

---

## Task 5：更新详情页（作品 / 文章 / 笔记）

**Files:**
- Modify: `app/(site)/works/[slug]/page.tsx`
- Modify: `app/(site)/posts/[slug]/page.tsx`
- Modify: `app/(site)/notes/[slug]/page.tsx`

**上下文：** 详情页需要适配新的 ContentDetail 组件接口。主要变化：meta 和 extra 的渲染方式保持不变，但需要传递新的 `prev` 和 `next` 导航数据。

**注意：**
- 作品详情页保留 demoUrl / repoUrl 按钮（作为 extra）
- 文章详情页保留日期 meta
- 笔记详情页保留分类标签 + 日期 meta
- 所有详情页都查询上一篇/下一篇用于导航

- [ ] **Step 1：更新作品详情页**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Code } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });
  if (!work) return { title: "Not Found" };
  return { title: work.title, description: work.description };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });

  if (!work) {
    notFound();
  }

  // Find prev/next
  const allWorks = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true },
  });
  const currentIndex = allWorks.findIndex((w) => w.slug === slug);
  const prev = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allWorks[currentIndex - 1] : null;

  return (
    <ContentDetail
      title={work.title}
      content={work.content || ""}
      coverUrl={work.coverUrl}
      backHref="/works"
      backLabel="返回作品列表"
      meta={
        <span className="text-sm text-muted-foreground">
          {new Date(work.createdAt).toLocaleDateString("zh-CN")}
        </span>
      }
      extra={
        <>
          <p className="text-base text-muted-foreground mb-4">{work.description}</p>
          <div className="flex flex-wrap gap-3">
            {work.demoUrl && (
              <a href={work.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  <ExternalLink className="h-4 w-4" />
                  查看演示
                </Button>
              </a>
            )}
            {work.repoUrl && (
              <a href={work.repoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <Code className="h-4 w-4" />
                  源代码
                </Button>
              </a>
            )}
          </div>
        </>
      }
      prev={prev ? { title: prev.title, href: `/works/${prev.slug}` } : null}
      next={next ? { title: next.title, href: `/works/${next.slug}` } : null}
    />
  );
}
```

- [ ] **Step 2：更新文章详情页**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";
import { Calendar } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  const allPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true },
  });
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <ContentDetail
      title={post.title}
      content={post.content}
      coverUrl={post.coverUrl}
      excerpt={post.excerpt || undefined}
      backHref="/posts"
      backLabel="返回文章列表"
      meta={
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(post.createdAt).toLocaleDateString("zh-CN")}
        </span>
      }
      prev={prev ? { title: prev.title, href: `/posts/${prev.slug}` } : null}
      next={next ? { title: next.title, href: `/posts/${next.slug}` } : null}
    />
  );
}
```

- [ ] **Step 3：更新笔记详情页**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDetail from "@/components/site/ContentDetail";
import { Calendar, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });
  if (!note || !note.published) return { title: "Not Found" };
  return { title: note.title };
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await prisma.note.findUnique({ where: { slug } });

  if (!note || !note.published) {
    notFound();
  }

  const allNotes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true },
  });
  const currentIndex = allNotes.findIndex((n) => n.slug === slug);
  const prev = currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allNotes[currentIndex - 1] : null;

  return (
    <ContentDetail
      title={note.title}
      content={note.content}
      coverUrl={note.coverUrl}
      backHref="/notes"
      backLabel="返回笔记列表"
      meta={
        <>
          {note.category && (
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[rgba(245,198,208,0.15)] text-miku-pink">
              <Tag className="h-3 w-3" />
              {note.category}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(note.createdAt).toLocaleDateString("zh-CN")}
          </span>
        </>
      }
      prev={prev ? { title: prev.title, href: `/notes/${prev.slug}` } : null}
      next={next ? { title: next.title, href: `/notes/${next.slug}` } : null}
    />
  );
}
```

- [ ] **Step 4：验证类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 5：提交**

```bash
git add app/(site)/works/[slug]/page.tsx app/(site)/posts/[slug]/page.tsx app/(site)/notes/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
feat: update detail pages with prev/next navigation

- Works: demo/repo buttons via Button component
- Posts: date meta with Calendar icon
- Notes: category tag + date meta
- All: prev/next navigation queries
- All: adapted to new ContentDetail interface
EOF
)"
```

---

## Task 6：里程碑 4 综合验证

- [ ] **Step 1：运行完整类型检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 2：运行开发服务器并全面检查**

Run: `npm run dev`
浏览器检查清单：
- [ ] 作品列表页：3 列网格卡片，毛玻璃标题区，hover 动画
- [ ] 文章列表页：纵向列表卡片，毛玻璃标题区
- [ ] 笔记列表页：纵向列表卡片，粉色分类标签
- [ ] 作品详情页：封面图、毛玻璃标题区、demo/repo 按钮、Markdown
- [ ] 文章详情页：封面图、毛玻璃标题区、摘要引用块、Markdown
- [ ] 笔记详情页：毛玻璃标题区、分类标签、Markdown
- [ ] Markdown 样式：标题、引用块、代码块、链接、列表、表格
- [ ] 上一篇/下一篇导航：作品/文章/笔记都有
- [ ] 深浅色模式：所有页面适配
- [ ] 移动端：布局正常

- [ ] **Step 3：最终提交**

```bash
git log --oneline -7
```
Expected: 看到 6-7 个里程碑 4 相关 commit

---

## 自我审查

### Spec 覆盖检查

| 设计文档要求 | 对应任务 |
|-------------|---------|
| 列表页统一风格（作品/文章/笔记）| Task 4 |
| 内容卡片组件（毛玻璃 + 封面 + 标签）| Task 1 |
| 详情页布局（封面 + 标题区 + Markdown）| Task 2 |
| Markdown 样式定制 | Task 3 |
| 上一篇/下一篇导航 | Task 2, 5 |

### Placeholder 扫描

- [x] 无 "TBD"/"TODO"
- [x] 无模糊描述
- [x] 所有代码步骤有完整代码

### 类型一致性检查

- [x] ContentCard variant prop: "grid" | "list"
- [x] ContentDetail prev/next: optional NavItem
- [x] 所有日期使用 toLocaleDateString("zh-CN")
- [x] 毛玻璃 className 模式在所有文件中一致
