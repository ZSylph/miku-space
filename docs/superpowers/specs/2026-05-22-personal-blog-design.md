# 个人博客全栈项目设计文档

**日期：** 2026-05-22  
**方案：** Next.js 15 + React + TypeScript + Tailwind CSS + Prisma + PostgreSQL  
**开发方式：** 增量式积木搭建，每步可运行验证

---

## 1. 项目概述

一个灵活可控的个人博客，主页采用积木式组件拼装，支持自由增删板块。包含前台展示和管理后台两套界面，通过全栈架构实现内容的在线管理。

**核心特征：**
- 主页像搭积木——各板块独立组件、独立数据，可随时增删改顺序
- 不同内容类型有不同子页面布局（作品、笔记、文章）
- 管理后台支持在线 CRUD 所有内容
- 构建时静态生成（SSG）+ ISR 增量更新，兼顾速度与实时性

---

## 2. 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | 全栈 React 框架 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS + shadcn/ui | 原子化 CSS + 基础组件 |
| 动画 | Framer Motion | 页面过渡、积木入场动画 |
| ORM | Prisma | 数据库建模与查询 |
| 数据库 | PostgreSQL (Neon) | 云端关系型数据库 |
| 部署 | Vercel | 前端 + API 一体化部署 |
| 图片存储 | Vercel Blob | 作品封面、文章配图 |
| 鉴权 | httpOnly Cookie Session | 单管理员登录 |

---

## 3. 路由结构

### 前台（游客可见）
| 路由 | 页面 | 数据获取 |
|------|------|----------|
| `/` | 主页（积木拼装） | Server Component → 数据库 |
| `/about` | 个人介绍 | Server Component |
| `/works` | 作品列表 | Server Component → 数据库 |
| `/works/[slug]` | 单个作品详情 | Server Component → 数据库 |
| `/notes` | 学习笔记列表 | Server Component → 数据库 |
| `/notes/[slug]` | 单篇笔记 | Server Component → 数据库 |
| `/posts` | 技术文章列表 | Server Component → 数据库 |
| `/posts/[slug]` | 单篇文章 | Server Component → 数据库 |

### 后台（管理员鉴权）
| 路由 | 页面 |
|------|------|
| `/admin/login` | 登录页 |
| `/admin` | 仪表板（内容统计） |
| `/admin/posts` | 文章列表 |
| `/admin/posts/new` | 新建文章 |
| `/admin/posts/edit/[id]` | 编辑文章 |
| `/admin/notes/*` | 笔记管理（同文章结构） |
| `/admin/works/*` | 作品管理 |
| `/admin/interests` | 兴趣卡片管理 |

### API 接口
| 路由 | 功能 |
|------|------|
| `POST /api/auth/login` | 管理员登录 |
| `POST /api/auth/logout` | 登出 |
| `GET /api/posts` | 文章列表 |
| `POST /api/posts` | 创建文章 |
| `PUT /api/posts/[id]` | 更新文章 |
| `DELETE /api/posts/[id]` | 删除文章 |
| （类似结构用于 notes, works, interests） |

---

## 4. 数据库设计（Prisma Schema）

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String   // MDX raw text
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
  content     String?  // MDX detail
  coverUrl    String?
  demoUrl     String?
  repoUrl     String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Interest {
  id          String @id @default(cuid())
  title       String
  description String
  icon        String // lucide icon name or emoji
  color       String // tailwind color class
  order       Int    @default(0)
  active      Boolean @default(true)
}

model Tag {
  id     String @id @default(cuid())
  name   String @unique
  slug   String @unique
  posts  Post[]
  notes  Note[]
}
```

---

## 5. 组件体系

### 5.1 三层架构

```
components/
├── ui/              ← shadcn/ui 基础元件（Button, Card, Input, Dialog）
├── blocks/          ← 页面积木（独立业务组件）
│   ├── HeroSection.tsx
│   ├── InterestGrid.tsx
│   ├── WorksPreview.tsx
│   ├── ContentFeed.tsx
│   └── ...
└── layout/          ← 布局框架
    ├── Navbar.tsx
    ├── Footer.tsx
    └── AdminLayout.tsx
```

### 5.2 积木设计原则

- **独立 props**：每个积木只接收纯数据，不直接操作文件或数据库
- **配置驱动**：主页通过 `data/home-sections.ts` 控制积木顺序和显隐
- **自包含动画**：每个积木内部用 Framer Motion 控制自己的入场效果

### 5.3 主页配置示例

```ts
// data/home-sections.ts
export const homeSections = [
  { id: 'hero', component: HeroSection },
  { id: 'interests', component: InterestGrid },
  { id: 'works', component: WorksPreview },
  { id: 'content', component: ContentFeed },
] as const;
```

---

## 6. 前台页面数据流

1. **构建时**：Next.js Server Component 通过 Prisma 查询数据库
2. **渲染**：数据注入 React 组件，生成静态 HTML
3. **部署**：静态页面 + API Routes 一并部署到 Vercel
4. **更新**：管理后台修改内容 → API Route 调用 `revalidatePath()` → 对应页面自动重新生成

---

## 7. 管理后台设计

### 7.1 登录鉴权
- 单管理员账号，账号密码存环境变量
- 登录成功后设置 httpOnly Cookie
- 中间件保护 `/admin/*`，未登录重定向 `/admin/login`

### 7.2 内容编辑器
- 左侧：Markdown 编辑区（textarea）
- 右侧：实时预览（react-markdown）
- 顶部工具栏：粗体、斜体、代码块、图片上传
- 图片上传：拖拽/粘贴 → Vercel Blob API → 返回 URL 插入编辑器

### 7.3 列表页
- 表格展示所有内容
- 支持搜索、筛选（已发布/草稿）
- 操作列：编辑、删除、预览

### 7.4 兴趣卡片管理
- 表格 + 拖拽排序
- 快捷开关：启用/禁用

---

## 8. 增量开发计划（积木式搭建）

按此顺序逐步搭建，每步完成后可运行查看：

1. **项目脚手架** — Next.js + TypeScript + Tailwind 初始化，跑通开发服务器
2. **数据库连接** — Prisma 初始化 + Neon PostgreSQL 连接 + 首个模型迁移
3. **全局布局** — Navbar + Footer + 全局字体/主题，所有页面有统一框架
4. **HeroSection** — 个人简介板块，主页第一个积木
5. **InterestGrid** — 兴趣卡片网格，可拖拽排序的数据结构
6. **WorksPreview** — 精选作品展示，链接到作品详情页
7. **ContentFeed** — 最新内容混合流
8. **作品/笔记/文章列表页** — 各内容类型的列表布局
9. **内容详情页** — MDX 渲染 + 代码高亮
10. **管理后台框架** — 登录页 + 中间件鉴权 + AdminLayout
11. **管理后台 CRUD** — 文章/笔记/作品的增删改查
12. **兴趣卡片管理** — 后台管理 + 前台联动
13. **搜索 + 暗黑模式** — Fuse.js 客户端搜索 + next-themes
14. **部署上线** — Vercel 部署 + 自定义域名

---

## 9. 部署方案

- **平台**：Vercel（与 Next.js 同生态）
- **数据库**：Neon PostgreSQL 免费层
- **环境变量**：
  - `DATABASE_URL` — Prisma 数据库连接串
  - `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` — 管理员凭据
  - `BLOB_READ_WRITE_TOKEN` — Vercel Blob 存储
- **特性**：Git 推送自动构建、分支预览、ISR 增量更新

---

## 10. 后续可扩展方向

- 评论系统（Giscus / 自建）
- 访客统计（Umami / Vercel Analytics）
- 国际化（next-intl）
- RSS 订阅生成
-  Newsletter 订阅
