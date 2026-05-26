# 个人博客项目 — 阶段四：完整前台页面体系

> **对应提交**：`54643d7` → `312af84` → `b47edc4` → `2f15b2c` → `7accfe7` → `b3666ff`  
> **新增内容**：WorksPreview/ContentFeed 组件、作品/文章/笔记/关于页面、Markdown 渲染、动态路由  
> **新增知识点**：动态路由 `[slug]`、`params` Promise、`notFound()`、ReactMarkdown、`Promise.all`、`as const`、条件渲染

---

## 目录

1. [新增文件一览](#1-新增文件一览)
2. [首页更新 — 四块积木拼装](#2-首页更新--四块积木拼装)
   - 2.1 `Promise.all` 并行查询
   - 2.2 数据合并与排序
   - 2.3 `as const` 字面量类型
3. [WorksPreview 组件](#3-workspreview-组件)
   - 3.1 `group-hover` 效果
   - 3.2 `aspect-video` 与图片占位
4. [ContentFeed 组件](#4-contentfeed-组件)
   - 4.1 联合类型数据
   - 4.2 条件路由
5. [列表页：作品 / 文章 / 笔记](#5-列表页作品--文章--笔记)
   - 5.1 作品列表页
   - 5.2 文章列表页
   - 5.3 笔记列表页
6. [详情页：动态路由 `[slug]`](#6-详情页动态路由-slug)
   - 6.1 Next.js 15 `params` 是 Promise
   - 6.2 `findUnique` 查询
   - 6.3 `notFound()` 404 处理
   - 6.4 作品详情页
   - 6.5 文章详情页
   - 6.6 笔记详情页
7. [Markdown 渲染](#7-markdown-渲染)
   - 7.1 ReactMarkdown + remark-gfm
   - 7.2 `@tailwindcss/typography`
   - 7.3 `prose` 与 `dark:prose-invert`
8. [关于页面](#8-关于页面)
9. [配置更新](#9-配置更新)
   - 9.1 `next.config.ts`
   - 9.2 `app/layout.tsx` — `suppressHydrationWarning`
   - 9.3 `package.json` 新依赖
10. [组件修改](#10-组件修改)
    - 10.1 HeroSection — Link 替换 a
    - 10.2 InterestGrid — colorMap 重构
    - 10.3 Footer — `"use client"`
11. [种子数据更新](#11-种子数据更新)
12. [知识检查清单](#12-知识检查清单)

---

## 1. 新增文件一览

### 新增组件

| 文件 | 类型 | 作用 |
|------|------|------|
| `components/blocks/WorksPreview.tsx` | Client Component | 首页精选作品预览（2列网格 + "查看全部"链接） |
| `components/blocks/ContentFeed.tsx` | Client Component | 首页最新内容混合流（文章+笔记列表） |

### 新增页面

| 文件 | URL | 作用 |
|------|-----|------|
| `app/(site)/works/page.tsx` | `/works` | 作品列表页 |
| `app/(site)/works/[slug]/page.tsx` | `/works/:slug` | 作品详情页 |
| `app/(site)/posts/page.tsx` | `/posts` | 文章列表页 |
| `app/(site)/posts/[slug]/page.tsx` | `/posts/:slug` | 文章详情页 |
| `app/(site)/notes/page.tsx` | `/notes` | 笔记列表页 |
| `app/(site)/notes/[slug]/page.tsx` | `/notes/:slug` | 笔记详情页 |
| `app/(site)/about/page.tsx` | `/about` | 关于我页面 |

### 新增种子脚本

| 文件 | 作用 |
|------|------|
| `prisma/seed-works.ts` | 插入 3 条作品测试数据 |
| `prisma/seed-content.ts` | 插入 1 篇文章 + 1 条笔记测试数据 |

---

## 2. 首页更新 — 四块积木拼装

**文件：** `app/(site)/page.tsx`

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

### 2.1 `Promise.all` 并行查询

```tsx
const [interests, works, posts, notes] = await Promise.all([
  prisma.interest.findMany(...),
  prisma.work.findMany(...),
  prisma.post.findMany(...),
  prisma.note.findMany(...),
]);
```

**为什么要用 `Promise.all`？**

这 4 个数据库查询**互相独立**，没有依赖关系。

| 方式 | 执行时间 | 说明 |
|------|----------|------|
| 串行（不用 Promise.all） | A + B + C + D | 等第一个查完再查第二个 |
| `Promise.all` 并行 | max(A, B, C, D) | 4 个同时查，等最慢的那个 |

```tsx
// ❌ 串行 — 慢
const interests = await prisma.interest.findMany(...);  // 50ms
const works = await prisma.work.findMany(...);           // 50ms
const posts = await prisma.post.findMany(...);           // 50ms
const notes = await prisma.note.findMany(...);           // 50ms
// 总计：200ms

// ✅ 并行 — 快
const [interests, works, posts, notes] = await Promise.all([
  prisma.interest.findMany(...),  // 50ms
  prisma.work.findMany(...),      // 50ms
  prisma.post.findMany(...),      // 50ms
  prisma.note.findMany(...),      // 50ms
]);
// 总计：~50ms（取决于最慢的那个）
```

**`Promise.all` 的工作方式：**

```
Promise.all([promiseA, promiseB, promiseC])
  ↓
同时开始执行 A、B、C
  ↓
等 A、B、C 全部完成后
  ↓
返回 [resultA, resultB, resultC]
```

### 2.2 查询参数详解

| 查询 | 参数 | 含义 |
|------|------|------|
| `interest.findMany` | `where: { active: true }` | 只查激活的 |
| | `orderBy: { order: "asc" }` | 按 order 升序 |
| `work.findMany` | `where: { featured: true }` | 只查精选作品 |
| | `take: 4` | 最多取 4 条 |
| `post.findMany` | `where: { published: true }` | 只查已发布的 |
| | `orderBy: { createdAt: "desc" }` | 按创建时间倒序（最新的在前） |
| | `take: 3` | 最多取 3 条 |

**`take: N`** 是 Prisma 的**分页/限制**参数，对应 SQL 的 `LIMIT N`：

```sql
SELECT * FROM Post WHERE published = true ORDER BY createdAt DESC LIMIT 3;
```

### 2.3 数据合并与排序

```tsx
const contentItems = [
  ...posts.map((p) => ({ ...p, type: "post" as const })),
  ...notes.map((n) => ({ ...n, type: "note" as const })),
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);
```

**步骤拆解：**

**第1步：展开运算符 `...` 合并数组**

```tsx
const contentItems = [
  ...posts,   // 把 posts 数组的元素逐个放入新数组
  ...notes,   // 把 notes 数组的元素逐个放入新数组
];
// 结果：[post1, post2, post3, note1, note2, note3]
```

**第2步：`map` 添加 type 标记**

```tsx
posts.map((p) => ({ ...p, type: "post" as const }))
```

| 语法 | 含义 |
|------|------|
| `{ ...p }` | 展开对象 p 的所有属性 |
| `type: "post"` | 新增 type 属性 |
| `as const` | 告诉 TypeScript：这是字面量 `"post"`，不是普通 string |

为什么需要 `as const`？

```tsx
// ❌ 不加 as const — type 被推断为 string
{ type: "post" }  // TypeScript 认为是 { type: string }

// ✅ 加 as const — type 被推断为字面量 "post"
{ type: "post" as const }  // TypeScript 认为是 { type: "post" }
```

ContentFeed 组件里用 `type: "post" | "note"` 区分内容类型，如果用 `string` 就太宽泛了。

**第3步：`sort` 按时间倒序**

```tsx
.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
```

| 比较 | 结果 | 含义 |
|------|------|------|
| `a.createdAt > b.createdAt` | 负数 | a 排在 b 后面 |
| `a.createdAt < b.createdAt` | 正数 | a 排在 b 前面 |
| `a.createdAt === b.createdAt` | 0 | 顺序不变 |

简单说就是：**时间越新越靠前**。

**第4步：`slice(0, 5)` 取前5条**

```tsx
.slice(0, 5)
```

只保留排序后的前 5 条，用于首页展示。

---

## 3. WorksPreview 组件

**文件：** `components/blocks/WorksPreview.tsx`

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
        <motion.h2 ...>精选作品</motion.h2>
        <Link href="/works" className="text-sm font-medium text-primary hover:underline">
          查看全部 →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map((work, index) => (
          <motion.div ...transition={{ delay: index * 0.1 }}>
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
                <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

### 3.1 `group-hover` 效果

```tsx
<div className="group ...">
  <h3 className="... group-hover:text-primary transition-colors">
```

**Tailwind 的 `group` 修饰符：**

| 类名 | 作用 |
|------|------|
| `group` | 在父元素上标记"这是一个组" |
| `group-hover:text-primary` | 当鼠标悬停在**父元素**（group）上时，应用这个样式 |

**效果：** 鼠标放在整个卡片上时，标题文字变色 —— 不需要单独给标题绑定 hover。

```
鼠标悬停在卡片上
    ↓
整个卡片: hover:shadow-lg（阴影加深）
    ↓
标题文字: group-hover:text-primary（变为主色）
```

### 3.2 `aspect-video` 与图片占位

```tsx
<div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center text-4xl">
  {work.coverUrl ? (
    <img src={work.coverUrl} alt={work.title} className="w-full h-full object-cover rounded-lg" />
  ) : (
    "🚀"
  )}
</div>
```

| 类名 | 作用 |
|------|------|
| `aspect-video` | 宽高比 16:9。无论宽度多少，高度自动保持 16:9 |
| `bg-muted` | 用 muted 背景色作为占位背景 |
| `object-cover` | 图片填充整个容器，保持比例，超出部分裁剪 |

**条件渲染：**

```tsx
{work.coverUrl ? (
  <img src={work.coverUrl} ... />   // 有封面图就显示图片
) : (
  "🚀"                                 // 没有就显示火箭 emoji
)}
```

---

## 4. ContentFeed 组件

**文件：** `components/blocks/ContentFeed.tsx`

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
      <motion.h2 ...>最新内容</motion.h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div ...>
            <Link
              href={`/${item.type === "post" ? "posts" : "notes"}/${item.slug}`}
              className="..."
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="...">
                  {item.type === "post" ? "文章" : "笔记"}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              {item.excerpt && <p className="...">{item.excerpt}</p>}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

### 4.1 联合类型

```tsx
interface ContentItem {
  ...
  type: "post" | "note";
}
```

`"post" | "note"` 是 TypeScript 的**联合类型（Union Type）**，表示 type 只能是这两个字符串之一。

```tsx
// ✅ 合法
{ type: "post" }
{ type: "note" }

// ❌ 报错
{ type: "article" }  // TypeScript 报错：不能赋值给 "post" | "note"
```

### 4.2 条件路由

```tsx
href={`/${item.type === "post" ? "posts" : "notes"}/${item.slug}`}
```

根据 `type` 决定链接地址：

| type | 生成的 href |
|------|------------|
| `"post"` | `/posts/my-first-post` |
| `"note"` | `/notes/typescript-notes` |

---

## 5. 列表页：作品 / 文章 / 笔记

三个列表页结构非常相似，都是：**查询数据库 → 渲染列表 → 每条可点击进入详情**。

### 5.1 作品列表页 — `app/(site)/works/page.tsx`

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

**注意：** 作品列表没有 `where` 条件，因为 Work 模型没有 `published` 字段，所有作品都展示。

### 5.2 文章列表页 — `app/(site)/posts/page.tsx`

```tsx
const posts = await prisma.post.findMany({
  where: { published: true },   // 只显示已发布的
  orderBy: { createdAt: "desc" },
});
```

和作品列表的区别：
- 有 `where: { published: true }` 过滤
- 没有图片占位，展示 `excerpt` 摘要

### 5.3 笔记列表页 — `app/(site)/notes/page.tsx`

```tsx
const notes = await prisma.note.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
});
```

笔记列表的特色：展示 `category` 分类标签。

```tsx
{note.category && (
  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
    {note.category}
  </span>
)}
```

`{note.category && (...)}` — 条件渲染：只有当 `category` 存在时才显示标签。

---

## 6. 详情页：动态路由 `[slug]`

Next.js App Router 中，**方括号文件夹名**表示动态路由：

| 文件路径 | 匹配 URL |
|----------|----------|
| `app/works/page.tsx` | `/works` |
| `app/works/[slug]/page.tsx` | `/works/personal-blog`、`/works/todo-app` |

### 6.1 Next.js 15 `params` 是 Promise

**重要变化！** Next.js 15 中，`params` 从同步对象变成了 **Promise**。

```tsx
// ❌ Next.js 14 — params 是直接的对象
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;  // 直接解构
}

// ✅ Next.js 15 — params 是 Promise
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;  // 需要 await
}
```

**为什么改成 Promise？**

为了支持 React 的 Streaming 和 Suspense 特性，让页面可以更早开始渲染。

### 6.2 `findUnique` 查询

```tsx
const work = await prisma.work.findUnique({ where: { slug } });
```

| 方法 | 返回 | 使用场景 |
|------|------|----------|
| `findMany` | 数组（0-N条） | 列表页 |
| `findUnique` | 单条或 null | 通过唯一字段查详情 |
| `findFirst` | 单条或 null | 通过非唯一条件查第一条 |

`findUnique` 要求查询条件是 `@unique` 或 `@id` 字段：

```prisma
model Work {
  slug String @unique   // ✅ 可以用 findUnique
  ...
}
```

对应 SQL：

```sql
SELECT * FROM Work WHERE slug = 'personal-blog' LIMIT 1;
```

### 6.3 `notFound()` — 404 处理

```tsx
import { notFound } from "next/navigation";

if (!work) {
  notFound();
}
```

当记录不存在时，调用 `notFound()` 函数：

1. 立即终止当前组件渲染
2. 显示 Next.js 的 404 页面（或你自定义的 `not-found.tsx`）
3. 返回 HTTP 404 状态码（对 SEO 友好）

**文章和笔记的额外检查：**

```tsx
// 文章详情页
if (!post || !post.published) {
  notFound();
}

// 笔记详情页
if (!note || !note.published) {
  notFound();
}
```

未发布的内容即使知道 slug 也无法访问。

### 6.4 作品详情页 — `app/(site)/works/[slug]/page.tsx`

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
      <Link href="/works">← 返回作品列表</Link>
      <h1>{work.title}</h1>
      <p>{work.description}</p>

      {(work.demoUrl || work.repoUrl) && (
        <div className="flex gap-4 mb-8">
          {work.demoUrl && (
            <a href={work.demoUrl} target="_blank" rel="noopener noreferrer">查看演示</a>
          )}
          {work.repoUrl && (
            <a href={work.repoUrl} target="_blank" rel="noopener noreferrer">源代码</a>
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

### 6.5 外部链接安全属性

```tsx
<a href={work.demoUrl} target="_blank" rel="noopener noreferrer">
```

| 属性 | 作用 |
|------|------|
| `target="_blank"` | 在新标签页打开 |
| `rel="noopener noreferrer"` | **安全属性**，防止新页面通过 `window.opener` 操纵原页面 |

**为什么需要 `rel="noopener noreferrer"`？**

```
没有 rel 时：
  新页面可以通过 window.opener.location = '恶意网站' 篡改原页面！

有 rel="noopener" 时：
  window.opener = null，新页面无法访问原页面
```

### 6.6 条件渲染按钮组

```tsx
{(work.demoUrl || work.repoUrl) && (
  <div className="flex gap-4 mb-8">
    {work.demoUrl && (...)}   {/* 有 demoUrl 才显示 */}
    {work.repoUrl && (...)}   {/* 有 repoUrl 才显示 */}
  </div>
)}
```

外层条件：如果两个链接都没有，整个按钮组不显示。  
内层条件：只显示存在的链接。

### 6.7 文章详情页 — `app/(site)/posts/[slug]/page.tsx`

和作品详情页类似，但有以下差异：

```tsx
// 额外检查 published
if (!post || !post.published) {
  notFound();
}

// 显示摘要（左边框装饰）
{post.excerpt && (
  <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary pl-4">
    {post.excerpt}
  </p>
)}
```

`border-l-2 border-primary pl-4` — 左边 2px 主色边框 + 左内边距，形成引用样式。

### 6.8 笔记详情页 — `app/(site)/notes/[slug]/page.tsx`

显示 `category` 分类标签：

```tsx
<div className="flex items-center gap-2 mb-8">
  {note.category && (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
      {note.category}
    </span>
  )}
  <span className="text-sm text-muted-foreground">{日期}</span>
</div>
```

---

## 7. Markdown 渲染

### 7.1 ReactMarkdown + remark-gfm

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>{work.content}</ReactMarkdown>
```

| 工具 | 作用 |
|------|------|
| `react-markdown` | 把 Markdown 字符串渲染成 React 组件/HTML |
| `remark-gfm` | 插件，支持 GitHub Flavored Markdown（表格、删除线、任务列表等） |

**为什么不用 `dangerouslySetInnerHTML`？**

```tsx
// ❌ 危险方式 — 容易 XSS 攻击
<div dangerouslySetInnerHTML={{ __html: markdownHtml }} />

// ✅ 安全方式 — ReactMarkdown 会转义特殊字符
<ReactMarkdown>{markdownString}</ReactMarkdown>
```

ReactMarkdown 在渲染时会：
1. 解析 Markdown 语法
2. 自动转义 HTML（防止 XSS）
3. 输出安全的 React 组件

### 7.2 `@tailwindcss/typography`

```bash
npm install -D @tailwindcss/typography
```

这是一个 Tailwind 插件，提供 `prose` 类名，为富文本内容（Markdown 渲染结果）自动应用美观的排版样式。

**没有 prose 时：**

```
# 标题    →  和普通文字一样大，没有样式
- 列表    →  没有缩进，没有圆点
段落      →  没有行高、没有段间距
```

**有 prose 时：**

```
# 标题    →  大号粗体，合适的上下边距
- 列表    →  有缩进，有圆点符号
段落      →  合适的行高和段间距
代码块    →  等宽字体，背景色
```

### 7.3 `prose` 与 `dark:prose-invert`

```tsx
<div className="prose dark:prose-invert max-w-none">
  <ReactMarkdown>{content}</ReactMarkdown>
</div>
```

| 类名 | 作用 |
|------|------|
| `prose` | 应用排版样式（标题、段落、列表、代码等） |
| `dark:prose-invert` | 暗色模式下反转颜色（文字变白，背景相关颜色适配） |
| `max-w-none` | 覆盖 prose 默认的最大宽度限制，让内容占满容器 |

---

## 8. 关于页面

**文件：** `app/(site)/about/page.tsx`

```tsx
export default function AboutPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">关于我</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>你好！我是一名热爱技术的开发者... </p>
        <h2>技能栈</h2>
        <ul>
          <li>前端：React, Next.js, TypeScript, Tailwind CSS</li>
          <li>后端：Node.js, Prisma, PostgreSQL</li>
          <li>工具：Git, VS Code, Figma</li>
        </ul>
        <h2>联系方式</h2>
        <p>欢迎通过邮件或社交媒体与我交流！</p>
      </div>
    </div>
  );
}
```

这是一个**纯静态页面**，没有任何数据查询：
- 不需要 `async`
- 不需要 `import { prisma }`
- 不需要 `"use client"`
- 纯粹的 Server Component

`prose` 类让原生 HTML（`h2`、`ul`、`li`、`p`）也有好看的样式。

---

## 9. 配置更新

### 9.1 `next.config.ts`

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

| 配置 | 作用 |
|------|------|
| `output: "standalone"` | 构建为独立输出，适合 Docker 或自定义服务器部署 |
| `images.unoptimized: true` | 禁用 Next.js 图片优化（简化部署，不需要 Vercel 图片服务） |

### 9.2 `app/layout.tsx` — `suppressHydrationWarning`

```tsx
<html lang="zh-CN" suppressHydrationWarning>
```

**什么是 Hydration Warning？**

Next.js 先服务端渲染 HTML，然后浏览器加载 JS 后 React 会 "hydrate"（接管已有 HTML 并绑定事件）。如果服务端渲染的 HTML 和客户端 React 渲染的结果不一致，React 会报警告。

**常见原因：**
- `next-themes` 主题切换：服务端不知道用户的主题偏好，可能渲染亮色；客户端检测到用户偏好暗色，渲染暗色
- `new Date().toLocaleString()`：服务端和客户端时区不同

`suppressHydrationWarning` 告诉 React：**如果只有这个元素（html）的属性和客户端不一致，不要报警告**。

### 9.3 `package.json` 新依赖

```json
"dependencies": {
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1"
},
"devDependencies": {
  "@tailwindcss/typography": "^0.5.19"
}
```

| 包名 | 类型 | 作用 |
|------|------|------|
| `react-markdown` | dependencies | Markdown → React 组件渲染 |
| `remark-gfm` | dependencies | GitHub Flavored Markdown 支持 |
| `@tailwindcss/typography` | devDependencies | Tailwind 排版样式插件 |

---

## 10. 组件修改

### 10.1 HeroSection — Link 替换 a

```tsx
// 旧
<a href="/works">查看作品</a>

// 新
<Link href="/works">查看作品</Link>
```

用 Next.js 的 `Link` 替代普通 `a` 标签，实现**客户端导航**（无整页刷新）。

### 10.2 InterestGrid — colorMap 重构

```tsx
// 新增加 colorMap
const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
};

// 使用时优先查 colorMap，找不到就用原值
className={`... ${colorMap[interest.color] || interest.color} ...`}
```

**为什么这样改？**

种子数据存储的是简写（如 `"blue"`），但 Tailwind 需要完整类名。`colorMap` 做了一层映射：

| 数据库存储 | colorMap 映射 | 最终类名 |
|-----------|--------------|---------|
| `"blue"` | `"bg-blue-100 text-blue-700"` | `bg-blue-100 text-blue-700` |
| `"pink"` | `"bg-pink-100 text-pink-700"` | `bg-pink-100 text-pink-700` |

`|| interest.color` 是兜底：如果 colorMap 找不到，直接用数据库里的值。

### 10.3 Footer — `"use client"`

Footer 加了 `"use client"`，可能是因为要支持后续的主题切换或其他客户端交互。

---

## 11. 种子数据更新

### 11.1 作品种子 — `prisma/seed-works.ts`

插入 3 条作品数据，其中 2 条 `featured: true`（会显示在首页）：

| 作品 | featured | 说明 |
|------|----------|------|
| 个人博客系统 | true | 有 demoUrl 和 repoUrl |
| 待办事项应用 | true | 无链接 |
| 天气预报小程序 | false | 不显示在首页 |

### 11.2 内容种子 — `prisma/seed-content.ts`

插入 1 篇文章 + 1 条笔记，内容包含 Markdown：

**文章内容示例：**

```markdown
# 我的第一篇技术文章

这是关于 Next.js 和 React 的学习笔记。

## 为什么选 Next.js

Next.js 提供了出色的开发体验...

## 核心概念

- **App Router**: 基于文件系统的路由
- **Server Components**: 减少客户端 JavaScript
- **ISR**: 增量静态再生成
```

**笔记内容示例：**

```markdown
# TypeScript 学习笔记

## 类型断言

```typescript
const value = someValue as string;
```

## 泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```
```

---

## 12. 知识检查清单

**动态路由**
- [ ] `[slug]` 文件夹匹配什么 URL？
- [ ] Next.js 15 中 `params` 为什么需要 `await`？
- [ ] `findUnique` 和 `findMany` 有什么区别？
- [ ] `notFound()` 做了什么？

**Markdown 渲染**
- [ ] `ReactMarkdown` 的作用是什么？
- [ ] `remark-gfm` 提供了什么额外功能？
- [ ] `prose` 和 `dark:prose-invert` 的作用？
- [ ] 为什么不用 `dangerouslySetInnerHTML`？

**数据操作**
- [ ] `Promise.all` 为什么比串行查询快？
- [ ] `take: 4` 对应 SQL 的什么语句？
- [ ] `as const` 的作用是什么？
- [ ] `...posts` 展开运算符做了什么？

**安全与配置**
- [ ] `target="_blank"` 为什么需要 `rel="noopener noreferrer"`？
- [ ] `suppressHydrationWarning` 解决了什么问题？
- [ ] `output: "standalone"` 的作用是什么？

**组件技巧**
- [ ] `group-hover` 怎么用？
- [ ] `aspect-video` 是什么比例？
- [ ] `space-y-4` 和 `gap-4` 有什么区别？

---

> **文档版本**：v1.0  
> **对应代码版本**：commit `b3666ff`（feat: add about page）  
> **编写日期**：2026-05-26
