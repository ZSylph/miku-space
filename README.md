# Miku Space

一个基于 Next.js App Router 构建的个人博客与作品集站点，融合了内容发布、后台管理、全文搜索、SEO 优化、社交分享和主题切换等能力。项目采用清爽的青绿视觉语言，并围绕文章、笔记、作品、兴趣、音乐等内容模块组织信息结构，兼顾展示效果与日常维护效率。

README：
**[简体中文](README.md)** | **[English](README.en.md)**

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite_/_D1-3-003B57?logo=sqlite)

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
- 支持图片与音频上传，开发环境保存至本地 `public/uploads/`，生产环境自动切换至 Cloudflare R2。
- 支持拖拽排序与精选标记，适合维护首页和专题内容展示。
- 后台登录采用基于 Cookie 的认证方案，并使用 HMAC 签名保护会话。

### 工程能力

- 使用 Prisma 管理数据库，开发环境使用本地 SQLite，生产环境通过 D1 adapter 对接 Cloudflare D1。
- 通过 @opennextjs/cloudflare 适配，部署到 Cloudflare Workers 边缘网络。
- 文件存储支持本地磁盘与 Cloudflare R2 双模式，通过环境变量自动切换。
- 配置了 ESLint、TypeScript 与 Tailwind CSS 4 的现代前端工程链路。

## 技术栈

- **框架**: Next.js 16.2.6 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, Framer Motion, Lucide React
- **内容**: React Markdown + remark-gfm
- **数据库**: SQLite (dev) / Cloudflare D1 (prod)
- **ORM**: Prisma 7.8.0 + @prisma/adapter-d1
- **存储**: 本地磁盘 (dev) / Cloudflare R2 (prod, @aws-sdk/client-s3)
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

### 数据库（仅本地开发）

| 变量名         | 必填 | 说明                                    |
| -------------- | ---- | --------------------------------------- |
| `DATABASE_URL` | 是   | 开发: `file:./dev.db`，生产环境通过 D1 binding 连接，无需此变量 |

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

### Cloudflare R2 对象存储（生产环境）

| 变量名                 | 必填     | 说明                                      |
| ---------------------- | -------- | ----------------------------------------- |
| `R2_ENDPOINT`          | 生产必填 | R2 S3 兼容 API 端点                       |
| `R2_ACCESS_KEY_ID`     | 生产必填 | R2 API Access Key ID                      |
| `R2_SECRET_ACCESS_KEY` | 生产必填 | R2 API Secret Access Key                  |
| `R2_BUCKET_NAME`       | 否       | Bucket 名称，默认 `miku-uploads`          |
| `R2_PUBLIC_URL`        | 生产必填 | R2 公共访问地址                           |

> 生产环境通过 `wrangler.jsonc` 配置 R2 binding 和 Secrets；本地开发无需配置，文件自动保存到 `public/uploads/`。

### 生成密钥

```bash
# 生成密码哈希
npx tsx scripts/hash-password.ts your-password

# 生成 ADMIN_SECRET
npx tsx -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 常用脚本

| 命令                     | 说明                                        |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | 启动本地开发服务器                          |
| `npm run build`          | 构建 Cloudflare Workers 兼容产物            |
| `npm run deploy`         | 构建并部署到 Cloudflare                     |
| `npm run preview`        | 本地预览 Cloudflare Workers（wrangler dev） |
| `npm run lint`           | 运行 ESLint                                 |
| `npm run db:seed`        | 导入种子数据                                |
| `npx prisma migrate dev` | 执行数据库迁移（开发）                      |
| `wrangler d1 migrations apply` | 推送迁移到 D1 数据库（生产）         |

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
  prisma.ts            Prisma 客户端（D1 adapter / 本地双模式）
  auth.ts              密码 scrypt 哈希与验证
  admin-auth.ts        后台 HMAC 会话签发与校验
  r2.ts                Cloudflare R2 S3 客户端与操作
  file-cleanup.ts      上传文件孤儿清理（本地/R2 双模式）
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

推荐部署方案：**Cloudflare Pages + Cloudflare D1 + Cloudflare R2**。

### 1. 创建 Cloudflare D1 数据库

```bash
# 安装 Wrangler CLI（如未安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create miku-space
```

创建完成后将返回的 `database_id` 填入 `wrangler.jsonc`。

### 2. 迁移本地数据到 D1

```bash
# 导出本地 SQLite 数据
sqlite3 dev.db .dump > dump.sql

# 导入到 D1
wrangler d1 execute miku-space --remote --file=dump.sql
```

### 3. 创建 Cloudflare R2 Bucket

```bash
# 创建 R2 存储桶
wrangler r2 bucket create miku-uploads
```

然后在 Cloudflare Dashboard → R2 中获取 API Token 和 Endpoint，并通过 `wrangler secret put` 设置 Secrets。

### 4. 部署到 Cloudflare Pages

```bash
# 构建并部署
npm run deploy
```

通过 `wrangler secret put` 设置敏感变量：

```bash
wrangler secret put ADMIN_SECRET
wrangler secret put ADMIN_PASSWORD_HASH
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
```

### 5. 推送 Schema 到 D1

```bash
# 生成迁移 SQL
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql

# 应用到远程 D1
wrangler d1 execute miku-space --remote --file=init.sql
```

### 6. 域名绑定

在 Cloudflare Dashboard → Pages → 项目中绑定自定义域名，Cloudflare 会自动配置 DNS 和 SSL。

## 安全说明

- `.env` 及所有 `.env.*`（除 `.env.example`）已被 `.gitignore` 排除，不会提交到 Git。
- `*.db` 数据库文件、`/public/uploads` 上传目录均在排除列表中。
- 后台密码使用 Node.js 原生 `scrypt` 算法哈希存储，会话 Cookie 使用 HMAC-SHA256 签名并做 timing-safe 比较。
- 推送到 GitHub 前请确认 `.env` 文件中不包含任何真实密钥。

## 维护建议

- 修改后台账号或密钥后，请通过 `wrangler secret put` 更新 Secrets 并重新部署。
- 调整 Prisma Schema 后，执行 `npx prisma migrate diff` 生成迁移 SQL，再通过 `wrangler d1 migrations apply`（生产）或 `npx prisma migrate dev`（开发）应用。
- 如果启用了自定义域名或外部图片源，请确认 `next.config.ts` 的 `remotePatterns` 与部署域名一致。
- 上传文件在本地开发时保存到 `public/uploads/`，生产环境自动使用 Cloudflare R2，无需修改代码。

## 许可证

本项目遵循 [MIT license](https://mit-license.org/) 开源协议，详细查看 [LICENSE](./LICENSE) 文件
