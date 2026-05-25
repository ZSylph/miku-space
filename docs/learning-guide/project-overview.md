# 个人博客项目 — 完整学习指南

> **适用阶段**：已完成前三个里程碑，准备进入页面组件开发之前  
> **目标**：完整理解项目架构、已实现的每一行代码及其背后的原理

---

## 目录

1. [项目概况](#1-项目概况)
2. [技术栈全景图](#2-技术栈全景图)
3. [已完成里程碑总览](#3-已完成里程碑总览)
4. [里程碑1：项目脚手架](#4-里程碑1项目脚手架)
5. [里程碑2：数据库与Prisma](#5-里程碑2数据库与prisma)
   - 5.1 环境变量配置
   - 5.2 Prisma 工具配置
   - 5.3 数据模型详解
   - 5.4 数据库迁移原理
   - 5.5 Prisma Client 单例模式
6. [里程碑3：全局样式与布局](#6-里程碑3全局样式与布局)
   - 6.1 Tailwind CSS v4 全局样式
   - 6.2 根布局组件
   - 6.3 工具函数
7. [项目文件结构](#7-项目文件结构)
8. [核心知识点速查表](#8-核心知识点速查表)
9. [后续学习计划](#9-后续学习计划)
10. [常用命令](#10-常用命令)

---

## 1. 项目概况

本项目是一个基于 **Next.js 16 + React 19 + TypeScript** 的全栈个人博客系统。

**核心特征：**
- 主页采用"积木式"组件拼装，各板块独立、可自由增删改顺序
- 包含前台展示（游客可见）和管理后台（管理员鉴权）两套界面
- 支持多种内容类型：技术文章、学习笔记、作品展示、兴趣卡片
- 构建时静态生成（SSG）+ ISR 增量更新，兼顾速度与实时性
- 支持亮色/暗色主题切换

**架构分层：**

```
┌────────────────────────────────────────┐
│  前台页面层 (app/(site)/...)            │  ← React Server Components 渲染
│  后台管理页 (app/(admin)/...)           │  ← 混合 Server/Client Components
│  API 路由层 (app/api/...)               │  ← 处理 CRUD 请求
├────────────────────────────────────────┤
│  组件层 (components/ui/blocks/layout)   │  ← 可复用 UI 组件
│  工具函数 (lib/)                        │  ← 数据库连接、鉴权等
├────────────────────────────────────────┤
│  Prisma Client (lib/prisma.ts)          │  ← ORM 数据库操作入口
│  Prisma Schema (prisma/schema.prisma)   │  ← 数据库模型定义
│  SQLite 数据库 (dev.db)                 │  ← 数据存储（本地文件）
└────────────────────────────────────────┘
```

---

## 2. 技术栈全景图

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端框架** | Next.js | 16.2.6 | 全栈 React 框架，App Router 路由 |
| **UI 库** | React | 19.2.6 | 构建用户界面 |
| **语言** | TypeScript | 5.x | 类型安全，IDE 智能提示 |
| **样式** | Tailwind CSS | 4.x | 原子化 CSS，快速构建界面 |
| **CSS 动画** | tw-animate-css | 1.x | Tailwind 动画工具 |
| **UI 组件** | shadcn/ui | 4.x | 预制可定制组件（Button 等） |
| **动画库** | Framer Motion | 12.x | 页面过渡、入场动画 |
| **主题切换** | next-themes | 0.4.x | 亮色/暗色模式管理 |
| **ORM** | Prisma | 7.8.x | 数据库建模与查询 |
| **数据库** | SQLite (via libsql) | — | 本地文件数据库 |
| **图标** | Lucide React | 1.16.x | 矢量图标库 |
| **密码哈希** | bcryptjs | 3.x | 管理员密码加密 |
| **字体** | Inter (Google Fonts) | — | 网页字体 |

---

## 3. 已完成里程碑总览

| 里程碑 | 内容 | 状态 |
|--------|------|------|
| 1 | 项目脚手架 — Next.js + TypeScript + Tailwind 初始化 | 已完成 |
| 2 | 数据库连接 — Prisma 初始化 + Schema 定义 + 迁移 + Client 设置 | 已完成 |
| 3（部分）| 全局样式 — 主题变量 + 全局 CSS + 根布局 + 字体配置 | 已完成 |

---

## 4. 里程碑1：项目脚手架

### 4.1 初始化过程

使用官方命令创建项目：

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

**各参数含义：**

| 参数 | 含义 |
|------|------|
| `--typescript` | 使用 TypeScript 作为开发语言 |
| `--tailwind` | 集成 Tailwind CSS 样式框架 |
| `--eslint` | 集成 ESLint 代码检查 |
| `--app` | 使用 Next.js App Router（新路由模式） |
| `--src-dir=false` | 不创建 `src/` 目录，代码直接放在项目根目录 |
| `--import-alias="@/*"` | 配置路径别名，`@/components` 等价于 `./components` |
| `--use-npm` | 使用 npm 作为包管理器 |

**创建后的关键文件：**

| 文件 | 初始作用 |
|------|----------|
| `app/` | 应用路由目录，所有页面放在这里 |
| `app/page.tsx` | 首页组件 |
| `app/layout.tsx` | 根布局，包裹所有页面 |
| `app/globals.css` | 全局样式文件 |
| `public/` | 静态资源目录（图片、字体等） |
| `package.json` | 项目依赖清单 |
| `tsconfig.json` | TypeScript 编译配置 |
| `next.config.ts` | Next.js 框架配置 |
| `postcss.config.mjs` | PostCSS 配置（Tailwind 的编译入口） |

### 4.2 核心依赖安装

```bash
npm install framer-motion prisma @prisma/client bcryptjs next-themes
npm install -D @types/bcryptjs
```

| 包名 | 作用 |
|------|------|
| `framer-motion` | 声明式动画库，用于页面过渡、滚动动画等 |
| `prisma` | Prisma CLI 工具，用于迁移、生成 Client |
| `@prisma/client` | Prisma 运行时库，代码里实际调用的 API |
| `bcryptjs` | 密码哈希（bcrypt 算法的纯 JS 实现，无需原生编译） |
| `next-themes` | Next.js 主题管理，支持 system/light/dark |

### 4.3 shadcn/ui 初始化

```bash
npx shadcn@latest init -y -d
```

shadcn/ui 是一个**组件集合**，与传统 UI 库（如 Ant Design）的区别：

- **不是 npm 包** — 组件代码直接复制到你的项目里（`components/ui/`）
- **完全可定制** — 可以任意修改源码
- **基于 Tailwind** — 样式通过 Tailwind 类名控制
- **依赖 Radix UI** — 底层使用 Radix 处理无障碍、焦点管理等复杂逻辑

初始化后新增的文件：

| 文件 | 作用 |
|------|------|
| `components.json` | shadcn 配置（组件路径、别名、基础颜色等） |
| `components/ui/button.tsx` | 示例：Button 组件源码 |
| `lib/utils.ts` | 工具函数 `cn()` — 合并 Tailwind 类名 |

---

## 5. 里程碑2：数据库与 Prisma

### 5.1 核心概念

**什么是 Prisma？**

Prisma 是一个 **ORM（Object-Relational Mapping，对象关系映射）** 工具。它的作用是在你的 TypeScript 代码和数据库之间充当"翻译官"。

**没有 ORM 时，你要手写 SQL：**

```sql
SELECT * FROM Post WHERE published = true ORDER BY createdAt DESC;
```

**有了 Prisma，你用对象操作：**

```typescript
await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" }
});
```

Prisma 会自动把这段代码翻译成上面的 SQL，执行查询，然后把结果包装成 TypeScript 对象返回给你。

**Prisma 的工作流程：**

```
Schema（设计图纸）
    ↓
npx prisma migrate dev    →  生成并执行 SQL，创建真实表
    ↓
npx prisma generate       →  生成 TypeScript 类型和 Client 代码
    ↓
代码里用 prisma.xxx.findMany()  →  Prisma 翻译成 SQL 执行
```

### 5.2 环境变量 — `.env`

**文件位置：** 项目根目录 `.env`

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$YourHashedPasswordHere"
```

**`.env` 的作用：** 存放**敏感配置**和**环境相关**的变量，不会提交到 Git（已加入 `.gitignore`）。

| 变量 | 作用 |
|------|------|
| `DATABASE_URL` | 数据库连接地址。`file:./dev.db` 表示使用 **SQLite**，数据库就是一个本地文件 `dev.db` |
| `ADMIN_USERNAME` | 后台管理员的登录账号 |
| `ADMIN_PASSWORD_HASH` | 管理员密码的 bcrypt 哈希值（不是明文） |

**为什么用 SQLite？**

SQLite 是一个**嵌入式数据库**，不需要安装服务器软件，整个数据库就是一个文件（`dev.db`）。对于本地开发来说非常方便——开箱即用。部署到线上时，可以无缝替换为 PostgreSQL 的连接串，代码无需改动。

### 5.3 Prisma 工具配置 — `prisma.config.ts`

**文件位置：** `prisma.config.ts`

```typescript
import "dotenv/config";                    // 加载 .env 文件
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",          // Schema 文件位置
  migrations: {
    path: "prisma/migrations",             // 迁移文件存放目录
  },
  datasource: {
    url: process.env["DATABASE_URL"],      // 从环境变量读取数据库地址
  },
});
```

**每行含义：**

| 行 | 作用 |
|----|------|
| `import "dotenv/config"` | 让 Node.js 读取 `.env` 文件，把变量注入 `process.env` |
| `schema` | 告诉 Prisma CLI："我的数据库模型定义在 `prisma/schema.prisma`" |
| `migrations.path` | 迁移文件存放到 `prisma/migrations/` 目录 |
| `datasource.url` | 数据库连接地址从环境变量读取 |

### 5.4 数据模型 — `prisma/schema.prisma`

**文件位置：** `prisma/schema.prisma`

这是整个数据库的**设计图纸**。Prisma 用它来自动创建数据库表、生成 TypeScript 类型、提供类型安全的查询 API。

#### 5.4.1 头部配置

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}
```

| 配置 | 含义 |
|------|------|
| `generator client` | 告诉 Prisma：运行 `prisma generate` 时，生成 JavaScript/TypeScript 客户端代码 |
| `datasource db` | 告诉 Prisma：使用的数据库类型是 SQLite |

> 设计文档中写的是 `provider = "postgresql"`，但实际配置是 `sqlite`。这是为了本地开发方便。Prisma 的好处就是**换数据库只需改这一行**，所有查询代码完全不变。

#### 5.4.2 Post 模型（技术文章）

```prisma
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
```

**逐字段详解：**

| 字段 | 类型 | 修饰符 | 含义 |
|------|------|--------|------|
| `id` | `String` | `@id` `@default(cuid())` | **主键**（唯一标识），默认自动生成唯一随机字符串 |
| `title` | `String` | 无 | 文章标题，**必填** |
| `slug` | `String` | `@unique` | URL 友好标识（如 `my-first-post`），**必须唯一** |
| `content` | `String` | 无 | 文章内容（Markdown 格式），**必填** |
| `excerpt` | `String?` | `?` 表示可选 | 文章摘要，可为空 |
| `coverUrl` | `String?` | 可选 | 封面图片 URL |
| `published` | `Boolean` | `@default(false)` | 是否发布，默认**未发布**（草稿） |
| `createdAt` | `DateTime` | `@default(now())` | 创建时间，默认当前时间 |
| `updatedAt` | `DateTime` | `@updatedAt` | 更新时间，**每次修改自动更新** |
| `tags` | `Tag[]` | 无 | 关联的标签（多对多关系） |

**修饰符详解：**

- **`@id`** — Primary Key（主键）。就像身份证号，每条记录必须有且唯一。数据库用它快速定位记录。
- **`@default(cuid())`** — 默认值。`cuid()` 是 Prisma 内置函数，生成类似 `cm8z3abc123def456` 的唯一字符串。你不需要手动传入 id，创建记录时自动填充。
- **`@unique`** — 唯一约束。数据库会确保这个字段没有重复值。`slug` 加唯一约束是因为 URL 地址不能重复（`/posts/my-first-post` 只能指向一篇文章）。
- **`String?`** — `?` 表示 Nullable（可为空）。没有 `?` 就是 NOT NULL（必填）。
- **`@default(false)`** — 布尔字段默认值。新创建的文章默认是草稿状态。
- **`@default(now())`** — 日期字段默认值。创建时自动填入当前时间。
- **`@updatedAt`** — 特殊修饰符。每次 UPDATE 操作时，Prisma 自动把当前时间写入该字段。你不需要手动维护。
- **`Tag[]`** — 数组类型，表示"多对多关系"。一篇文章可以有多个标签，一个标签也可以属于多篇文章。

#### 5.4.3 Note 模型（学习笔记）

```prisma
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
```

与 `Post` 几乎一致，区别：
- 多了 `category` 字段（笔记分类，如"前端"、"后端"）
- 少了 `excerpt` 字段

**为什么分成两个模型？** 虽然结构相似，但业务含义不同。文章是正式发表的，笔记是随手记录的。分开管理更灵活，以后加字段不会互相影响。

#### 5.4.4 Work 模型（作品/项目）

```prisma
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
```

**特有字段：**

| 字段 | 类型 | 含义 |
|------|------|------|
| `description` | `String` | 项目简介（展示在卡片上的短描述） |
| `demoUrl` | `String?` | 在线演示链接 |
| `repoUrl` | `String?` | 源代码仓库链接（如 GitHub） |
| `featured` | `Boolean` | 是否"精选"（`true` 会显示在首页） |
| `order` | `Int` | 排序序号（数字越小越靠前） |

> **注意**：`Work` 没有 `tags` 关系和 `published` 字段。说明作品默认都展示，不需要草稿状态，也不需要标签分类。

#### 5.4.5 Interest 模型（兴趣卡片）

```prisma
model Interest {
  id          String  @id @default(cuid())
  title       String
  description String
  icon        String
  color       String
  order       Int     @default(0)
  active      Boolean @default(true)
}
```

首页"正在做的事"板块的卡片数据：

| 字段 | 含义 |
|------|------|
| `icon` | 图标标识（如 `"Code"`、`"Palette"`），代码里映射成具体图标 |
| `color` | Tailwind 颜色类名（如 `"bg-blue-100 text-blue-700"`） |
| `active` | 是否显示在首页（可以暂时隐藏某张卡片） |

#### 5.4.6 Tag 模型（标签）

```prisma
model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
  notes Note[]
}
```

标签系统。`name` 和 `slug` 都加唯一约束，防止重复标签。

#### 5.4.7 多对多关系详解

`Post` 有 `tags Tag[]`，`Tag` 也有 `posts Post[]` —— 这就是**多对多关系**。

Prisma 在底层会自动创建一个**关联表**来维护这种关系。看看迁移文件中的 SQL：

```sql
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id"),
    CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id")
);
```

| 列 | 含义 |
|----|------|
| `A` | Post 的 id（外键，指向 Post 表） |
| `B` | Tag 的 id（外键，指向 Tag 表） |
| `FOREIGN KEY` | 外键约束，确保引用的记录真实存在 |

**但你完全不需要操作这个关联表！** Prisma 会自动处理。例如：

```typescript
// 查询文章时自动带上标签
await prisma.post.findMany({ include: { tags: true } });

// 给文章添加标签
await prisma.post.update({
  where: { id: "abc" },
  data: { tags: { connect: [{ id: "xyz" }] } }
});
```

这就是 ORM 的强大之处 —— 你用对象和关系的方式思考，底层复杂的关联表操作由 Prisma 自动完成。

### 5.5 数据库迁移 — `prisma/migrations/20260524160529_init/migration.sql`

**迁移（Migration）** 是把 Schema 改动应用到真实数据库的过程。

**工作流程：**

```
修改 schema.prisma
        ↓
npx prisma migrate dev --name init
        ↓
Prisma 对比新旧 Schema，生成差异 SQL
        ↓
SQL 在 dev.db 上执行（创建表、字段、索引等）
        ↓
迁移文件保存到 prisma/migrations/ 目录
```

**迁移文件的作用：**

1. **版本历史** — 记录了数据库结构的所有变更，可回溯
2. **团队协作** — 其他成员按顺序执行迁移，保证数据库结构一致
3. **生产部署** — 部署时按迁移文件升级生产数据库

**生成的 SQL 关键部分：**

```sql
-- 创建 Post 表
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    ...
);

-- 给 slug 加唯一索引（防止重复 URL）
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- 创建多对多关联表
CREATE TABLE "_PostToTag" (...);
```

| SQL 语句 | 作用 |
|----------|------|
| `CREATE TABLE` | 创建数据表 |
| `PRIMARY KEY` | 指定主键 |
| `NOT NULL` | 字段不能为空 |
| `DEFAULT` | 默认值 |
| `CREATE UNIQUE INDEX` | 创建唯一索引（加速查询 + 防重复） |
| `CREATE INDEX` | 创建普通索引（加速查询） |
| `FOREIGN KEY` | 外键约束，维护表之间的关系 |

### 5.6 Prisma Client — `lib/prisma.ts`

**文件位置：** `lib/prisma.ts`

这是**所有数据库操作的统一入口**。任何页面或 API 要读写数据库，都要 `import` 这个文件里的 `prisma` 实例。

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// 第1步：创建 libsql 客户端（连接 SQLite 数据库文件）
const libsql = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

// 第2步：创建适配器（Prisma ↔ libsql 之间的翻译层）
const adapter = new PrismaLibSQL(libsql);

// 第3步：全局单例模式（防止开发时创建多个数据库连接）
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### 逐段详解

**第1步：libsql 客户端**

```typescript
const libsql = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
```

- `libsql` 是 SQLite 的现代化实现，比传统 SQLite 更快
- `createClient` 创建数据库连接
- `url` 从 `.env` 读取，如果读不到则回退到 `./dev.db`

**第2步：Prisma 适配器**

```typescript
const adapter = new PrismaLibSQL(libsql);
```

- Prisma 本身不能直接和 libsql 通信
- `PrismaLibSQL` 是**适配器（Adapter）**，充当翻译官
- 它把 Prisma 的标准操作翻译成 libsql 能理解的指令

**第3步：全局单例模式（非常重要！）**

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**为什么要这么写？**

在开发模式下（`npm run dev`），Next.js 会**热重载**（修改代码后自动刷新）。每次热重载都会重新执行模块代码。

如果没有单例模式：
```
第一次热重载 → 创建 PrismaClient #1 → 占用 1 个数据库连接
第二次热重载 → 创建 PrismaClient #2 → 占用 2 个数据库连接
第三次热重载 → 创建 PrismaClient #3 → 占用 3 个数据库连接
... → 连接越来越多，最终耗尽数据库资源，报错！
```

有了单例模式：
```
第一次加载：
  globalForPrisma.prisma = undefined
  → 创建新的 PrismaClient → 存到 globalForPrisma.prisma
  → 导出给页面使用

第二次热重载：
  globalForPrisma.prisma = 之前创建的那个（还在！）
  → 直接复用，不再创建新的
```

- `globalThis` 是 JavaScript 全局对象（类似浏览器的 `window`）
- 把实例挂在 `globalThis` 上，热重载时不会被清除
- `??`（空值合并运算符）：左边为 null/undefined 时才执行右边
- `process.env.NODE_ENV !== "production"`：只在开发环境保存全局实例

**实际使用方式：**

```typescript
// 在任意页面或 API 中
import { prisma } from "@/lib/prisma";

// 查询所有已发布的文章
const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" }
});

// 创建新文章
const newPost = await prisma.post.create({
  data: {
    title: "新文章",
    slug: "new-post",
    content: "文章内容...",
    published: true
  }
});
```

---

## 6. 里程碑3：全局样式与布局

### 6.1 全局样式 — `app/globals.css`

**文件位置：** `app/globals.css`

这是整个应用的**全局 CSS 入口**，使用 Tailwind CSS v4 的新语法。

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  ...（更多颜色变量）
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  ...（更多 CSS 变量）
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  ...（暗色模式变量）
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

#### Tailwind CSS v4 新语法详解

Tailwind CSS v4 相比 v3 有重大变化，核心思想是**用 CSS 变量驱动主题**。

**`@import "tailwindcss"`**

旧版（v3）需要写三行：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

新版（v4）简化为：
```css
@import "tailwindcss";
```

**`@import "tw-animate-css"`**

引入 Tailwind 动画工具，提供 `animate-in`、`animate-out` 等动画类名。

**`@custom-variant dark`**

定义暗色模式的触发条件：当任意父元素有 `.dark` 类时，匹配 `dark:` 变体。

**`@theme inline`**

这是 v4 的核心新概念。它把 Tailwind 的设计令牌（颜色、字体、圆角等）映射到 CSS 变量上。

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --radius-lg: var(--radius);
}
```

| 语法 | 含义 |
|------|------|
| `--color-background` | 注册一个名为 `background` 的颜色令牌 |
| `--font-sans` | 注册无衬线字体令牌 |
| `--radius-lg` | 注册大圆角令牌 |

注册后，你就可以在 HTML/JSX 中使用这些 Tailwind 类名：

```jsx
<div className="bg-background text-foreground rounded-lg">
  这个 div 的背景、文字颜色、圆角都来自主题变量
</div>
```

**`:root` — 亮色模式（默认）**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --radius: 0.5rem;
}
```

这里定义的是 **HSL 颜色值**（色相-饱和度-亮度）：

- `0 0% 100%` = 白色（H=0, S=0%, L=100%）
- `240 10% 3.9%` = 接近纯黑的深灰色

为什么用 HSL？因为 HSL 比十六进制更直观，调整亮度只需改最后一个数字。

**`.dark` — 暗色模式**

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
}
```

当 `<html>` 或 `<body>` 有 `class="dark"` 时，所有使用 `--background` 的地方自动切换为暗色值。这就是主题切换的核心原理。

**`@layer base`**

定义基础样式规则：

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

| 规则 | 作用 |
|------|------|
| `* { border-border }` | 所有元素的边框颜色使用 `--border` 变量 |
| `body { bg-background text-foreground }` | body 背景用亮色/暗色变量，文字颜色对应反转 |
| `html { font-sans }` | 全局使用无衬线字体（Inter） |

### 6.2 根布局 — `app/layout.tsx`

**文件位置：** `app/layout.tsx`

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

**逐行解析：**

| 代码 | 含义 |
|------|------|
| `import type { Metadata } from "next"` | 导入 Next.js 的元数据类型（仅用于 TypeScript 类型检查，不会打包到产物中） |
| `import { Inter } from "next/font/google"` | 从 next/font 导入 Inter 字体。Next.js 会自动优化加载 |
| `const inter = Inter({ subsets: ["latin"] })` | 配置 Inter 字体，只加载拉丁字符子集，减少文件体积 |
| `export const metadata` | 页面元数据（SEO），包括标题和描述 |
| `RootLayout` | 根布局组件，**所有页面都会被套在这个组件里** |
| `children: React.ReactNode` | 子元素类型。每个具体页面（如 `page.tsx`）的内容会作为 `children` 传入 |
| `Readonly<>` | TypeScript 工具类型，表示 props 是只读的，不可修改 |
| `<html lang="zh-CN">` | 设置页面语言为中文，利于搜索引擎和屏幕阅读器 |
| `<body className={inter.className}>` | body 应用 Inter 字体类名 |
| `{children}` | 渲染子页面内容 |

**Next.js App Router 的布局概念：**

```
app/
├── layout.tsx      ← 根布局（包裹所有页面）
├── page.tsx        ← 首页内容 → 作为 children 传入 layout
├── about/
│   └── page.tsx    ← 关于页面 → 作为 children 传入 layout
└── posts/
    └── page.tsx    ← 文章列表 → 作为 children 传入 layout
```

所有页面共享 `layout.tsx` 中的结构（字体、全局样式、html lang 等），但 `children` 部分各不相同。

### 6.3 工具函数 — `lib/utils.ts`

**文件位置：** `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

这是 shadcn/ui 项目的标志性工具函数，也是 Tailwind 开发中最常用的辅助函数。

**`clsx`** — 条件类名拼接：

```typescript
clsx("base-class", isActive && "active-class", { "hidden": !visible })
// 如果 isActive=true, visible=true → "base-class active-class"
// 如果 isActive=false, visible=false → "base-class hidden"
```

**`twMerge`** — 解决 Tailwind 类名冲突：

```typescript
// 如果不使用 twMerge：
"px-2 px-4"  → 两个 padding-x 类冲突，结果不可预测

// 使用 twMerge 后：
twMerge("px-2 px-4")  →  "px-4"  （后面的覆盖前面的）
```

**`cn` 函数组合了两者：**

```tsx
<button className={cn("base-btn", isPrimary && "bg-primary", className)}>
```

- `clsx` 处理条件拼接
- `twMerge` 处理冲突覆盖
- 常用于 shadcn/ui 组件，让调用者传入的 `className` 能覆盖默认样式

---

## 7. 项目文件结构

```
E:/code/zsxy/
├── app/                          # Next.js App Router（所有路由页面）
│   ├── globals.css               # 全局 CSS + Tailwind 主题变量
│   ├── layout.tsx                # 根布局（字体、元数据、全局结构）
│   ├── page.tsx                  # 首页（目前是 Next.js 默认欢迎页）
│   └── favicon.ico               # 网站图标
│
├── components/                   # React 组件
│   └── ui/
│       └── button.tsx            # shadcn/ui Button 组件示例
│
├── lib/                          # 工具函数和共享模块
│   ├── prisma.ts                 # Prisma Client 单例实例（数据库入口）
│   └── utils.ts                  # cn() 工具函数
│
├── prisma/                       # Prisma 相关文件
│   ├── schema.prisma             # 数据库模型定义（设计图纸）
│   ├── config.ts                 # Prisma CLI 配置
│   └── migrations/               # 数据库迁移历史
│       ├── 20260524160529_init/  # 首次迁移
│       │   └── migration.sql     # 实际执行的 SQL
│       └── migration_lock.toml   # 迁移锁定文件
│
├── public/                       # 静态资源（图片、字体等，直接通过 URL 访问）
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
│
├── docs/                         # 文档目录
│   ├── superpowers/
│   │   ├── specs/                # 设计规格文档
│   │   │   └── 2026-05-22-personal-blog-design.md
│   │   └── plans/                # 实现计划文档
│   │       └── 2026-05-22-personal-blog.md
│   └── learning-guide/           # 学习指南（本文档）
│       └── project-overview.md
│
├── .env                          # 环境变量（敏感配置，不提交 Git）
├── .gitignore                    # Git 忽略规则
├── components.json               # shadcn/ui 配置
├── dev.db                        # SQLite 数据库文件（本地数据）
├── next.config.ts                # Next.js 配置
├── package.json                  # 项目依赖和脚本
├── postcss.config.mjs            # PostCSS 配置（Tailwind 编译入口）
├── prisma.config.ts              # Prisma 工具配置（已废弃，被 config.ts 替代）
└── tsconfig.json                 # TypeScript 配置（路径别名等）
```

---

## 8. 核心知识点速查表

### 8.1 Prisma 相关

| 概念 | 一句话解释 |
|------|-----------|
| **ORM** | 用代码操作数据库，不用手写 SQL |
| **Schema** | 数据库的设计图纸，定义表和字段 |
| **Migration** | 按图纸施工，把 Schema 变成真实的数据库表 |
| **Prisma Client** | TypeScript 代码中操作数据库的 SDK |
| **Adapter** | Prisma 和具体数据库之间的翻译层 |
| **`@id`** | 主键，唯一标识一条记录 |
| **`@unique`** | 唯一约束，防止重复 |
| **`@default()`** | 默认值，不填时自动填充 |
| **`String?`** | 可选字段（可为空），`?` = Nullable |
| **`@updatedAt`** | 自动更新字段，每次修改记录时刷新为当前时间 |
| **`Model[]`** | 一对多 / 多对多关系 |
| **关联表** | Prisma 自动创建，维护多对多关系 |
| **单例模式** | 全局复用同一个实例，避免资源泄漏 |
| **`globalThis`** | JavaScript 全局对象，热重载时数据不会丢失 |

### 8.2 Tailwind CSS v4 相关

| 概念 | 一句话解释 |
|------|-----------|
| **`@theme inline`** | 定义设计令牌（颜色、字体、圆角），注册为 Tailwind 类名 |
| **CSS 变量** | `--background` 等变量，亮色/暗色模式切换时改变值 |
| **`@apply`** | 在 CSS 文件中使用 Tailwind 类名 |
| **`@layer base`** | 基础样式层，定义全局默认样式 |
| **HSL 颜色** | `色相 饱和度 亮度` 格式，比十六进制更易调节 |
| **`dark:` 变体** | 在 `.dark` 父元素下生效的样式前缀 |
| **`cn()`** | 合并类名 + 解决冲突的工具函数 |

### 8.3 Next.js App Router 相关

| 概念 | 一句话解释 |
|------|-----------|
| **App Router** | Next.js 新路由系统，基于文件目录结构 |
| **layout.tsx** | 布局组件，包裹所有子页面，共享 UI 结构 |
| **page.tsx** | 页面组件，对应一个路由地址 |
| **`children` prop** | 子页面内容，由 Next.js 自动传入 |
| **Server Component** | 服务端渲染的组件，可以直接查询数据库 |
| **Client Component** | 客户端渲染的组件，可以使用 useState、事件处理等 |
| **Metadata** | 页面 SEO 信息（标题、描述等） |
| **next/font** | 内置字体优化，自动加载和缓存 Google 字体 |
| **`@/*` 路径别名** | `tsconfig.json` 配置的路径映射，简化导入 |

---

## 9. 后续学习计划

根据设计文档，接下来需要完成的里程碑：

| 序号 | 里程碑 | 内容 | 预计涉及的新知识 |
|------|--------|------|-----------------|
| 3 | 全局布局 | Navbar + Footer + 站点分组布局 | 路由分组 `(site)`、`"use client"`、React state |
| 4 | HeroSection | 主页头图/自我介绍板块 | Framer Motion 动画、组件 props |
| 5 | InterestGrid | 兴趣卡片网格 | 数据库查询、服务端组件传 props |
| 6 | WorksPreview | 精选作品展示 + 作品页面 | 数据查询、图片占位、动态路由 `[slug]` |
| 7 | ContentFeed | 最新内容混合流 | 多表查询、数据合并排序 |
| 8 | 文章/笔记页面 | 列表页 + 详情页 | Markdown 渲染、动态路由 |
| 9 | 关于页面 | 静态内容页面 | 纯静态 Server Component |
| 10 | 管理后台框架 | 登录 + 中间件鉴权 | `middleware.ts`、Cookie、bcrypt |
| 11 | 文章 CRUD | 增删改查 | API Routes、`route.ts`、表单处理 |
| 12 | 作品/笔记 CRUD | 复用模式 | 相同模式，不同模型 |
| 13 | 兴趣管理 | 拖拽排序 | 客户端状态管理 |
| 14 | 搜索 + 暗黑模式 | Fuse.js + next-themes | 客户端搜索、主题切换 |
| 15 | 部署上线 | Vercel | 环境变量、构建配置 |

---

## 10. 常用命令

```bash
# 启动开发服务器
npm run dev

# 查看 Prisma 数据库可视化界面
npx prisma studio

# 验证 Schema 格式是否正确
npx prisma validate

# 创建新迁移（Schema 修改后执行）
npx prisma migrate dev --name 迁移名称

# 生成 Prisma Client（Schema 修改后执行）
npx prisma generate

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

---

> **文档版本**：v1.0  
> **对应代码版本**：commit `551eb8e`（db: run migration and setup Prisma client）  
> **编写日期**：2026-05-25
