# Miku Space

一个基于 Next.js App Router 构建的个人博客与作品集站点，融合了内容发布、后台管理、全文搜索、SEO 优化、社交分享和主题切换等能力。项目采用清爽的青绿视觉语言，并围绕文章、笔记、作品、兴趣、音乐等内容模块组织信息结构，兼顾展示效果与日常维护效率。

English documentation: [README.en.md](README.en.md)

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite_/_libSQL-3-003B57?logo=sqlite)

## 项目特性

### 前台展示

- 首页采用 Hero、兴趣模块、精选作品、最新内容流和个人侧栏组合，突出个人风格与核心内容。
- 文章、笔记均支持独立列表与详情页，内容以 Markdown 为核心渲染方式，附带阅读时间估算和社交分享按钮。
- 作品以网格卡片展示，点击直接跳转 GitHub 仓库。
- 搜索页使用 ContentShell 布局，支持站内内容按标签筛选与全文检索。
- 关于页用于展示个人简介、技术栈与联系方式。
- 内置主题切换，支持亮色、暗色与系统跟随模式。
- 完整的 SEO 支持：OG / Twitter Card 元标签、canonical URL、robots.txt 和 sitemap.xml。
- 全站适配桌面端与移动端，并保留较完整的交互反馈与动效。

### 内容与管理

- 后台支持文章、笔记、作品、兴趣、歌曲等内容类型的创建、编辑、排序与删除。
- 支持草稿 / 发布状态管理，便于内容分阶段上线。
- 支持图片与音频上传，开发环境保存至本地 `public/uploads/`，生产环境自动切换至 Vercel Blob。
- 支持拖拽排序与精选标记，适合维护首页和专题内容展示。
- 后台登录采用基于 Cookie 的认证方案，并使用 HMAC 签名保护会话。

### 工程能力

- 使用 Prisma + libSQL 适配器管理数据库，开发环境使用本地 SQLite，生产环境对接 Turso 云数据库。
- 采用 Next.js Standalone 输出，适合 Vercel 或 Node.js 服务器部署。
- 文件存储支持本地磁盘与 Vercel Blob 双模式，通过环境变量自动切换。
- 配置了 ESLint、TypeScript 与 Tailwind CSS 4 的现代前端工程链路。

## 技术栈

- **框架**: Next.js 16.2.6 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, Framer Motion, Lucide React
- **内容**: React Markdown + remark-gfm
- **数据库**: SQLite (dev) / Turso libSQL (prod)
- **ORM**: Prisma 7.8.0 + @prisma/adapter-libsql
- **存储**: 本地磁盘 (dev) / Vercel Blob (prod, @vercel/blob)
- **类型**: TypeScript 5, Zod 校验

## 快速开始

### 环境要求

- Node.js 20+
- npm 或其他包管理器

### 安装与启动

```bash
git clone https://github.com/ZSylph/miku-space.git
cd zsxy

npm install

cp .env.example .env
# 按需填写数据库与后台认证信息

npx prisma migrate dev
npm run db:seed

npm run dev
```

启动后访问：

- 前台：http://localhost:3000
- 后台登录：http://localhost:3000/admin/login

## 环境变量

在项目根目录创建 `.env` 文件，按以下分组配置。

### 数据库

| 变量名                | 必填     | 说明                                                              |
| --------------------- | -------- | ----------------------------------------------------------------- |
| `DATABASE_URL`        | 是       | 开发: `file:./dev.db`；生产: Turso 连接串 `libsql://xxx.turso.io` |
| `DATABASE_AUTH_TOKEN` | 生产必填 | Turso 认证令牌，通过 `turso db tokens create <name>` 生成         |

### 站点

| 变量名     | 必填 | 说明                                                                               |
| ---------- | ---- | ---------------------------------------------------------------------------------- |
| `SITE_URL` | 否   | 站点公开域名，用于 RSS、Sitemap、OG 标签生成绝对链接，默认 `http://localhost:3000` |

### 管理后台

| 变量名                | 必填 | 说明                                         |
| --------------------- | ---- | -------------------------------------------- |
| `ADMIN_USERNAME`      | 是   | 后台登录用户名                               |
| `ADMIN_PASSWORD_HASH` | 是   | 密码 scrypt 哈希值                           |
| `ADMIN_SECRET`        | 是   | Session Cookie HMAC 签名密钥，建议 64 位 hex |

### Vercel Blob 对象存储（生产环境）

| 变量名                    | 必填     | 说明                                                 |
| ------------------------- | -------- | ---------------------------------------------------- |
| `BLOB_READ_WRITE_TOKEN`   | 生产必填 | Vercel Blob 读写令牌，在 Vercel 项目 Storage 中自动获取 |

> 本地开发无需配置 Blob 变量，文件会自动保存到 `public/uploads/`。

### 生成密钥

```bash
# 生成密码哈希
npx tsx -e "console.log(require('./lib/auth').hashPassword('your-password'))"

# 生成 ADMIN_SECRET
npx tsx -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 常用脚本

| 命令                     | 说明                             |
| ------------------------ | -------------------------------- |
| `npm run dev`            | 启动开发服务器                   |
| `npm run build`          | 构建生产版本                     |
| `npm run start`          | 启动生产服务器                   |
| `npm run lint`           | 运行 ESLint                      |
| `npm run db:seed`        | 导入种子数据                     |
| `npx prisma migrate dev` | 执行数据库迁移（开发）           |
| `npx prisma db push`     | 推送 schema 到远程数据库（生产） |

## 目录结构

```text
app/
  (site)/              前台公开页面
    page.tsx           首页
    posts/             文章列表与详情
    notes/             笔记列表与详情
    works/             作品展示
    about/             关于页
    search/            搜索页
  (admin)/             后台管理区
    admin/             Dashboard 与 CRUD 页面
  admin/               登录页
  api/                 API 路由（认证、CRUD、上传）
  robots.ts            robots.txt 生成
  sitemap.ts           sitemap.xml 生成
components/
  blocks/              首页与页面区块组件
  layout/              导航、侧边栏、页脚等布局组件
  site/                前台详情、卡片与分享组件
  admin/               后台表单、表格与上传组件
  pages/               搜索等页面级客户端组件
lib/
  prisma.ts            Prisma 客户端单例（libSQL 适配器）
  auth.ts              密码 scrypt 哈希与验证
  admin-auth.ts        后台 HMAC 会话签发与校验
  blob.ts              Vercel Blob 客户端与操作
  file-cleanup.ts      上传文件孤儿清理（本地/Blob 双模式）
  site-config.ts       站点全局配置（社交链接、SEO 等）
  validation.ts        Zod 表单校验规则
  api-utils.ts         API 响应辅助函数
prisma/
  schema.prisma        数据模型定义
  migrations/          数据库迁移文件
  seed.ts              种子数据
public/
  uploads/             本地上传文件目录（.gitignore 排除）
```

## 数据模型

| 模型       | 说明                                           |
| ---------- | ---------------------------------------------- |
| `Post`     | 文章内容、封面、标签、发布状态与排序           |
| `Note`     | 笔记内容、标签、封面、发布状态与排序           |
| `Work`     | 作品展示、仓库链接、技术栈、精选与排序         |
| `Interest` | 兴趣项、描述、颜色、图标、图片、排序与启用状态 |
| `Song`     | 音乐内容、音频/封面、歌词、排序与启用状态      |
| `Tag`      | 标签名称与 slug                                |

## 部署指南

推荐部署方案：**Vercel + Turso + Vercel Blob**。

### 1. 创建 Turso 数据库

```bash
# 安装 Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 登录并创建数据库
turso auth signup
turso db create miku-space

# 获取连接信息
turso db show miku-space --url
turso db tokens create miku-space
```

### 2. 迁移本地数据到 Turso

```bash
# 导出本地 SQLite 数据
sqlite3 dev.db .dump > dump.sql

# 导入到 Turso
turso db shell miku-space < dump.sql
```

### 3. 启用 Vercel Blob

1. 进入 Vercel 项目 Settings → Storage
2. 点击 Create Database，选择 Blob 类型
3. 创建完成后，`BLOB_READ_WRITE_TOKEN` 会自动注入到项目环境变量中

### 4. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录部署
vercel
```

在 Vercel 项目 Settings > Environment Variables 中配置：

```
DATABASE_URL=libsql://xxx.turso.io
DATABASE_AUTH_TOKEN=eyJ...
ADMIN_SECRET=your-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-scrypt-hash
SITE_URL=https://your-domain.com
```

### 5. 推送 Schema 到生产数据库

```bash
DATABASE_URL="libsql://xxx.turso.io" \
DATABASE_AUTH_TOKEN="eyJ..." \
npx prisma db push
```

### 6. 域名绑定

在 Vercel 项目 Settings > Domains 中添加自定义域名，按提示配置 DNS 记录。

## 安全说明

- `.env` 及所有 `.env.*`（除 `.env.example`）已被 `.gitignore` 排除，不会提交到 Git。
- `*.db` 数据库文件、`/public/uploads` 上传目录均在排除列表中。
- 后台密码使用 Node.js 原生 `scrypt` 算法哈希存储，会话 Cookie 使用 HMAC-SHA256 签名并做 timing-safe 比较。
- 推送到 GitHub 前请确认 `.env` 文件中不包含任何真实密钥。

## 维护建议

- 修改后台账号或密钥后，请同步更新 Vercel 环境变量并重新部署。
- 调整 Prisma Schema 后，执行 `npx prisma db push`（生产）或 `npx prisma migrate dev`（开发）。
- 如果启用了自定义域名或外部图片源，请确认 `next.config.ts` 的 `remotePatterns` 与部署域名一致。
- 上传文件在本地开发时保存到 `public/uploads/`，生产环境自动使用 Vercel Blob，无需修改代码。

## 许可证

[MIT](LICENSE)
