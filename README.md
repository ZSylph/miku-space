# ZSXY Personal Blog

一个基于 Next.js App Router 的个人博客与作品展示站点，包含文章、笔记、作品与个人介绍。

## 项目概览

- 站点形态：个人博客 + 作品集
- 渲染方式：App Router + Server Components
- 内容来源：Prisma + SQLite/libSQL

## 功能模块

- 首页：个人介绍、兴趣、精选作品、最新内容聚合
- 作品：作品列表与详情页
- 文章：技术文章列表与详情页（Markdown 渲染）
- 笔记：学习笔记列表与详情页（Markdown 渲染）
- 关于：个人简介与技能栈

## 技术栈

- Framework: Next.js 16 App Router
- Language: TypeScript + React 19
- Styling: Tailwind CSS v4 + tw-animate-css
- Data: Prisma + SQLite/libSQL
- UI/Animation: Base UI, framer-motion
- Markdown: react-markdown + remark-gfm

## 目录结构

```
app/
	(site)/
		page.tsx               # 首页
		about/page.tsx          # 关于
		works/                  # 作品列表与详情
		posts/                  # 文章列表与详情
		notes/                  # 笔记列表与详情
	layout.tsx                # 根布局
	globals.css               # 全局样式
components/
	blocks/                   # 首页区块组件
	layout/                   # 导航与页脚
	ui/                       # 通用 UI 组件
lib/
	prisma.ts                 # Prisma client
	utils.ts                  # 工具函数
prisma/
	schema.prisma             # 数据模型
	migrations/               # 迁移记录
	seed*.ts                  # 初始化数据
```

## 环境要求

- Node.js 18.18+ 或 20+
- npm 9+（或 pnpm/yarn/bun）

## 配置

创建环境变量文件：

```
DATABASE_URL="file:./dev.db"
```

## 安装与运行

```bash
npm install

# 生成 Prisma Client（首次或 schema 变更后）
npx prisma generate

# 应用迁移并创建本地数据库
npx prisma migrate dev

# 写入示例数据
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 常用命令

```bash
npm run dev       # 本地开发
npm run build     # 生产构建
npm run start     # 启动生产服务
npm run lint      # ESLint 检查
npm run db:seed   # 写入示例数据
```

## 数据模型

- Post：文章
- Note：笔记
- Work：作品
- Interest：兴趣
- Tag：标签

## 部署说明

- 已启用 `output: "standalone"`，可直接使用 Next.js Standalone 部署
- 若使用自托管数据库，将 `DATABASE_URL` 指向对应实例

## 常见问题

- Prisma CLI 需要正确的 `DATABASE_URL`，请确认环境变量已设置。
