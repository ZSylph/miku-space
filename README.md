# 个人博客与作品集

一个基于 Next.js App Router 构建的现代化个人博客与作品展示站点。支持 Markdown 内容管理、后台 CRUD、暗黑模式切换和响应式设计。

## 技术栈

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

## 功能特性

### 前台

- **首页** — Hero 区域、兴趣标签、精选作品、最新内容流
- **文章** — Markdown 渲染的文章列表与详情页
- **笔记** — 按分类组织的笔记列表与详情页
- **作品** — 网格卡片布局的作品展示，支持演示链接与源码链接
- **搜索** — 全文搜索文章、笔记和作品
- **关于** — 个人介绍页
- **主题切换** — 亮色 / 暗黑 / 跟随系统
- **响应式设计** — 适配桌面端与移动端

### 管理后台

- **仪表盘** — 内容统计数据概览
- **文章管理** — 创建、编辑、发布/草稿、删除
- **笔记管理** — 创建、编辑、分类、发布/草稿、删除
- **作品管理** — 创建、编辑、精选标记、排序、删除
- **兴趣管理** — 创建、编辑、颜色标记、启用/禁用、排序
- **文件上传** — 本地图片上传（限制 5MB）
- **Cookie 认证** — 基于 HMAC 签名的安全登录

## 快速开始

### 前置要求

- Node.js >= 20
- npm 或 pnpm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd zsxy

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 ADMIN_SECRET、ADMIN_USERNAME、ADMIN_PASSWORD_HASH

# 初始化数据库
npx prisma migrate dev

# 可选：导入种子数据
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前台，访问 http://localhost:3000/admin/login 进入管理后台。

## 环境变量

创建 `.env` 文件，配置以下变量：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# 管理后台认证（必须）
ADMIN_SECRET=your-random-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-scrypt-password-hash

# 可选：生产环境标记
NODE_ENV=production
```

生成密码哈希的方法：

```bash
npx tsx -e "console.log(require('./lib/auth').hashPassword('your-password'))"
```

## 项目结构

```
app/
  (site)/              # 前台公开页面（共享 Navbar + Footer）
    page.tsx           # 首页
    posts/             # 文章列表 / 详情
    notes/             # 笔记列表 / 详情
    works/             # 作品列表 / 详情
    about/             # 关于页
    search/            # 搜索页
  (admin)/             # 后台认证区域（共享认证 Layout）
    admin/             # Dashboard / CRUD 管理页
  admin/               # 登录页（不受认证保护）
  api/                 # API 路由
components/
  admin/               # 后台通用组件（表格、表单、上传）
  site/                # 前台通用组件（卡片、详情布局）
  blocks/              # 页面区块组件（Hero、兴趣网格等）
  layout/              # 布局组件（Navbar、Footer）
  shared/              # 共享组件（Loading 骨架屏）
lib/
  prisma.ts            # Prisma 客户端单例
  auth.ts              # 密码哈希与验证
  admin-auth.ts        # Cookie Session 签发与校验
  validation.ts        # Zod 表单校验 Schema
  api-utils.ts         # API 响应工具
  colorMap.ts          # 共享颜色映射
  types.ts             # 类型工具（Jsonified）
prisma/
  schema.prisma        # 数据模型定义
  seed.ts              # 种子数据
```

## 常用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run db:seed` | 导入种子数据 |

## 数据模型

```prisma
Post      # 文章（标题、Slug、内容、摘要、封面、发布状态）
Note      # 笔记（标题、Slug、内容、分类、封面、发布状态）
Work      # 作品（标题、Slug、描述、内容、封面、演示/仓库链接、精选、排序）
Interest  # 兴趣（标题、描述、图标、颜色、排序、启用状态）
Tag       # 标签（预留）
```

## 部署

本项目配置为 `output: 'standalone'`，适合部署到支持 Node.js 的平台：

```bash
npm run build
npm run start
```

## 许可证

[MIT](LICENSE)
