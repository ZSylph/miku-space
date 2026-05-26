# 个人博客项目 — 阶段三：InterestGrid 兴趣卡片与数据库联动

> **对应提交**：`4984ca7`  
> **新增内容**：InterestGrid 兴趣卡片组件、首页数据库查询、种子数据脚本、Prisma Client 适配器更新  
> **新增知识点**：TypeScript 接口、async Server Component、Prisma 查询、滚动触发动画、种子数据

---

## 目录

1. [新增文件一览](#1-新增文件一览)
2. [里程碑5：InterestGrid 兴趣卡片](#2-里程碑5interestgrid-兴趣卡片)
   - 2.1 组件代码逐行解析
   - 2.2 TypeScript 接口（interface）
   - 2.3 Framer Motion 滚动触发动画
   - 2.4 响应式网格布局
3. [里程碑5续：首页数据查询](#3-里程碑5续首页数据查询)
   - 3.1 async Server Component
   - 3.2 Prisma `findMany` 查询详解
   - 3.3 数据流向图
4. [种子数据脚本](#4-种子数据脚本)
   - 4.1 `prisma/seed.ts`
   - 4.2 `deleteMany` + `create`
   - 4.3 `npm run db:seed`
5. [Prisma Client 适配器更新](#5-prisma-client-适配器更新)
6. [知识检查清单](#6-知识检查清单)

---

## 1. 新增文件一览

| 文件 | 类型 | 作用 |
|------|------|------|
| `components/blocks/InterestGrid.tsx` | 业务组件（Client） | 兴趣卡片网格，带滚动入场动画 |
| `prisma/seed.ts` | 脚本 | 向数据库插入测试数据 |
| `app/(site)/page.tsx` | 页面组件（Server） | 首页 — 查询数据库 + 渲染 HeroSection + InterestGrid |

**修改的文件：**

| 文件 | 修改内容 |
|------|----------|
| `lib/prisma.ts` | 适配器初始化方式更新（简化） |
| `package.json` | 新增 `db:seed` 脚本、`tsx`、`dotenv-cli` 依赖 |

---

## 2. 里程碑5：InterestGrid 兴趣卡片

### 2.1 组件代码 — `components/blocks/InterestGrid.tsx`

```tsx
"use client";

import { motion } from "framer-motion";

interface Interest {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InterestGridProps {
  interests: Interest[];
}

const iconMap: Record<string, string> = {
  Code: "💻",
  Palette: "🎨",
  BookOpen: "📚",
  Camera: "📷",
};

export default function InterestGrid({ interests }: InterestGridProps) {
  return (
    <section className="container py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold mb-8 text-center"
      >
        正在做的事
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl p-6 ${interest.color} hover:scale-105 transition-transform cursor-default`}
          >
            <div className="text-3xl mb-3">{iconMap[interest.icon] || "✨"}</div>
            <h3 className="font-semibold text-lg mb-1">{interest.title}</h3>
            <p className="text-sm opacity-80">{interest.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

### 2.2 TypeScript 接口（interface）

```tsx
interface Interest {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InterestGridProps {
  interests: Interest[];
}
```

**什么是 interface？**

`interface` 是 TypeScript 用来**定义对象形状**的方式。它描述了"一个对象应该有哪些字段，每个字段是什么类型"。

**为什么要定义 interface？**

1. **类型安全**：如果你传了一个缺少 `title` 的 `interest`，TypeScript 会在编译时报错
2. **IDE 提示**：写代码时，编辑器会自动提示 `interest.` 后面有哪些属性可用
3. **文档作用**：看一眼 interface 就知道组件需要什么数据

**对比：有 interface vs 无 interface**

```tsx
// ❌ 没有 interface — 容易出错
function MyComponent({ data }) {
  return <div>{data.titel}</div>;  // 拼写错误！但 JS 不会报错
}

// ✅ 有 interface — TypeScript 会报错
interface Data {
  title: string;
}
function MyComponent({ data }: { data: Data }) {
  return <div>{data.titel}</div>;  // ❌ TypeScript 报错：属性 'titel' 不存在
}
```

**你的 Interest interface：**

```tsx
interface Interest {
  id: string;        // 唯一标识
  title: string;     // 卡片标题
  description: string;  // 卡片描述
  icon: string;      // 图标名称
  color: string;     // Tailwind 颜色类名
}
```

这个 interface 对应数据库里的 `Interest` 模型（`prisma/schema.prisma`），但只选取了组件需要的字段。

**为什么组件里只定义了 5 个字段？**

数据库的 `Interest` 模型有 7 个字段：

```prisma
model Interest {
  id          String  // ✅ 需要（作为 React key）
  title       String  // ✅ 需要
  description String  // ✅ 需要
  icon        String  // ✅ 需要
  color       String  // ✅ 需要
  order       Int     // ❌ 不需要（服务端已排序）
  active      Boolean // ❌ 不需要（服务端已过滤）
}
```

组件 interface 只包含它实际用到的字段，这是良好的设计 —— **组件不需要知道数据库的全部细节**。

### 2.3 图标映射

```tsx
const iconMap: Record<string, string> = {
  Code: "💻",
  Palette: "🎨",
  BookOpen: "📚",
  Camera: "📷",
};
```

**`Record<K, V>`** 是 TypeScript 的内置类型，表示"键类型为 K，值类型为 V 的对象"。

这里 `Record<string, string>` 等价于：
```tsx
const iconMap: { [key: string]: string } = { ... };
```

**用法：**

```tsx
{iconMap[interest.icon] || "✨"}
```

- `interest.icon` 是数据库里存的值（如 `"Code"`）
- `iconMap["Code"]` 返回 `"💻"`
- `|| "✨"` 是**默认值**：如果 `iconMap` 里没有这个 key，就显示星星

### 2.4 Framer Motion 滚动触发动画

#### 标题动画

```tsx
<motion.h2
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="..."
>
  正在做的事
</motion.h2>
```

| 属性 | 含义 |
|------|------|
| `initial={{ opacity: 0, y: 20 }}` | 初始状态：透明，向下偏移 20px |
| `whileInView={{ opacity: 1, y: 0 }}` | **滚动到视口内时**触发：完全不透明，回到原位 |
| `viewport={{ once: true }}` | 只触发一次（滚出再滚回不会重复动画） |

**`whileInView` vs `animate` 的区别：**

| 属性 | 触发时机 | 使用场景 |
|------|----------|----------|
| `animate` | 组件挂载时立即执行 | 页面加载动画（如 HeroSection） |
| `whileInView` | **滚动到可视区域时**执行 | 滚动入场动画（如 InterestGrid） |

#### 卡片交错动画（Stagger Effect）

```tsx
{interests.map((interest, index) => (
  <motion.div
    key={interest.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`...`}
  >
```

**`transition={{ delay: index * 0.1 }}`** — 这是关键！

| 卡片 | index | delay | 延迟时间 |
|------|-------|-------|----------|
| 第 1 张 | 0 | 0 * 0.1 | 0s（最先出现） |
| 第 2 张 | 1 | 1 * 0.1 | 0.1s |
| 第 3 张 | 2 | 2 * 0.1 | 0.2s |
| 第 4 张 | 3 | 3 * 0.1 | 0.3s |

**效果**：卡片依次出现，形成**波浪式入场**（stagger animation），比同时出现更有层次感。

### 2.5 响应式网格布局

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

| 类名 | 屏幕宽度 | 列数 |
|------|----------|------|
| `grid-cols-1` | < 640px（手机） | 1 列 |
| `sm:grid-cols-2` | ≥ 640px（大手机/小平板） | 2 列 |
| `lg:grid-cols-4` | ≥ 1024px（笔记本/桌面） | 4 列 |
| `gap-4` | 所有屏幕 | 卡片间距 1rem（16px） |

**移动端效果：**

```
┌─────────────┐      ┌───────┬───────┐      ┌────┬────┬────┬────┐
│   卡片 1    │  →   │ 卡1  │ 卡2  │  →   │卡1 │卡2 │卡3 │卡4 │
│   卡片 2    │      │ 卡3  │ 卡4  │      └────┴────┴────┴────┘
│   卡片 3    │      └───────┴───────┘
│   卡片 4    │
└─────────────┘
   < 640px         640px - 1024px         ≥ 1024px
```

### 2.6 卡片样式

```tsx
className={`rounded-xl p-6 ${interest.color} hover:scale-105 transition-transform cursor-default`}
```

| 类名 | 作用 |
|------|------|
| `rounded-xl` | 大圆角（0.75rem） |
| `p-6` | 内边距 1.5rem（24px） |
| `${interest.color}` | 动态颜色类名，从数据库读取（如 `bg-blue-100 text-blue-700`） |
| `hover:scale-105` | 鼠标悬停时放大到 105% |
| `transition-transform` | 放大有过渡动画 |
| `cursor-default` | 默认光标（不是手型，表示不可点击） |

**动态类名拼接：**

注意这里用的是**模板字符串**（backticks）而非 `cn()`，因为颜色类名是从数据库动态传入的：

```tsx
className={`rounded-xl p-6 ${interest.color} ...`}
// 运行时变成：
// className="rounded-xl p-6 bg-blue-100 text-blue-700 hover:scale-105 ..."
```

---

## 3. 里程碑5续：首页数据查询

### 3.1 页面代码 — `app/(site)/page.tsx`

```tsx
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/blocks/HeroSection";
import InterestGrid from "@/components/blocks/InterestGrid";

export default async function HomePage() {
  const interests = await prisma.interest.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <HeroSection />
      <InterestGrid interests={interests} />
    </div>
  );
}
```

### 3.2 async Server Component

```tsx
export default async function HomePage() {
  const interests = await prisma.interest.findMany({ ... });
  // ...
}
```

**这是 React 的一个革命性特性！** 在传统的 React 中，函数组件不能是 `async` 的：

```tsx
// ❌ React 18 之前不行
function Component() {
  const data = await fetchData();  // 报错！不能在组件里用 await
}
```

**React Server Components（RSC）** 允许组件直接是 `async` 的：

```tsx
// ✅ Server Component 可以 async
export default async function HomePage() {
  const data = await prisma.interest.findMany();  // 直接在服务端查询数据库！
  return <div>{data.map(...)}</div>;
}
```

**关键优势：**

| 传统方式（Client Component） | Server Component 方式 |
|---------------------------|----------------------|
| 1. 浏览器请求页面 | 1. 服务端查询数据库 |
| 2. 加载 JS | 2. 渲染 HTML |
| 3. JS 执行，发起 API 请求 | 3. 发送 HTML 给浏览器 |
| 4. 等待 API 返回 | 4. 浏览器直接显示内容 |
| 5. 渲染数据 | |

Server Component **减少了一次网络往返**，首屏更快，SEO 更好。

### 3.3 Prisma `findMany` 查询详解

```tsx
const interests = await prisma.interest.findMany({
  where: { active: true },
  orderBy: { order: "asc" },
});
```

**`findMany` 是 Prisma 的查询方法**，返回符合条件的所有记录，类型是数组 `Interest[]`。

#### `where` 过滤

```tsx
where: { active: true }
```

只返回 `active` 字段为 `true` 的记录。对应 SQL：

```sql
SELECT * FROM Interest WHERE active = true;
```

#### `orderBy` 排序

```tsx
orderBy: { order: "asc" }
```

按 `order` 字段升序排列（从小到大）。对应 SQL：

```sql
SELECT * FROM Interest WHERE active = true ORDER BY "order" ASC;
```

**Prisma 查询 → SQL 对照表：**

| Prisma 查询 | 对应 SQL |
|------------|----------|
| `prisma.interest.findMany()` | `SELECT * FROM Interest` |
| `findMany({ where: { active: true } })` | `SELECT * FROM Interest WHERE active = true` |
| `findMany({ orderBy: { order: "asc" } })` | `SELECT * FROM Interest ORDER BY "order" ASC` |
| `findUnique({ where: { id: "xxx" } })` | `SELECT * FROM Interest WHERE id = 'xxx' LIMIT 1` |

### 3.4 数据流向图

```
┌────────────────────────────────────────────────────────────┐
│                        服务端（Node.js）                     │
│                                                            │
│   1. 用户请求 /                                            │
│       ↓                                                    │
│   2. Next.js 匹配到 app/(site)/page.tsx                    │
│       ↓                                                    │
│   3. 执行 HomePage()（Server Component）                    │
│       ↓                                                    │
│   4. prisma.interest.findMany()                            │
│       ↓                                                    │
│   5. Prisma 翻译成 SQL → SQLite 查询 dev.db                │
│       ↓                                                    │
│   6. 返回数据：[{id, title, description, icon, color}, ...]│
│       ↓                                                    │
│   7. 数据通过 props 传给 InterestGrid                      │
│       ↓                                                    │
│   8. 渲染完整 HTML                                         │
└────────────────────────────────────────────────────────────┘
                            ↓
                    发送 HTML 到浏览器
                            ↓
┌────────────────────────────────────────────────────────────┐
│                        浏览器                               │
│                                                            │
│   9. 显示静态内容（标题、文字等）                           │
│       ↓                                                    │
│  10. 加载 JS，React "hydrate"                              │
│       ↓                                                    │
│  11. Framer Motion 激活，滚动动画开始工作                    │
│       ↓                                                    │
│  12. 用户滚动到 InterestGrid 区域 → 卡片依次动画入场         │
└────────────────────────────────────────────────────────────┘
```

---

## 4. 种子数据脚本

### 4.1 `prisma/seed.ts`

```tsx
import { prisma } from "../lib/prisma";

async function main() {
  // 先清空已有数据，避免重复
  await prisma.interest.deleteMany();

  const interests = [
    { title: "前端开发", description: "React, Next.js, TypeScript", icon: "Code", color: "bg-blue-100 text-blue-700", order: 0, active: true },
    { title: "设计", description: "UI/UX, Figma, 动画", icon: "Palette", color: "bg-pink-100 text-pink-700", order: 1, active: true },
    { title: "阅读", description: "技术书籍, 科幻小说", icon: "BookOpen", color: "bg-green-100 text-green-700", order: 2, active: true },
    { title: "摄影", description: "街头摄影, 风景", icon: "Camera", color: "bg-amber-100 text-blue-700", order: 3, active: true },
  ];

  for (const interest of interests) {
    await prisma.interest.create({ data: interest });
  }

  console.log("Seed data inserted:", interests.length, "interests");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4.2 逐段解析

**清空已有数据：**

```tsx
await prisma.interest.deleteMany();
```

- `deleteMany()` — 删除表中**所有**记录
- 为什么要先清空？因为种子脚本可能被执行多次。如果不先清空，每次运行都会新增重复数据
- 对应 SQL：`DELETE FROM Interest;`

**创建记录：**

```tsx
for (const interest of interests) {
  await prisma.interest.create({ data: interest });
}
```

- `prisma.interest.create()` — 创建单条记录
- `{ data: interest }` — `data` 字段传入要插入的数据对象
- 对应 SQL：`INSERT INTO Interest (title, description, ...) VALUES (...);`

**错误处理：**

```tsx
main()
  .catch((e) => {
    console.error(e);    // 打印错误
    process.exit(1);     // 进程退出码 1（表示失败）
  })
  .finally(async () => {
    await prisma.$disconnect();  // 无论成功失败，最后断开数据库连接
  });
```

- `.catch()` — 捕获异步错误
- `.finally()` — 无论成功还是失败，最后都会执行
- `prisma.$disconnect()` — 关闭数据库连接，释放资源

### 4.3 运行种子脚本

```bash
npm run db:seed
```

这条命令在 `package.json` 中定义为：

```json
"db:seed": "tsx prisma/seed.ts"
```

| 工具 | 作用 |
|------|------|
| `tsx` | 直接运行 TypeScript 文件，无需先编译成 JS |
| `prisma/seed.ts` | 要执行的种子脚本 |

**为什么用 `tsx` 而不是 `node`？**

因为 `node` 只能运行 JavaScript 文件，不能运行 TypeScript：

```bash
node prisma/seed.ts     # ❌ 报错！Node 不认识 .ts 文件
tsx prisma/seed.ts      # ✅ tsx 会即时编译并运行
```

**运行后的效果：**

```bash
> npm run db:seed

> zsxy@0.1.0 db:seed
> tsx prisma/seed.ts

Seed data inserted: 4 interests
```

数据库 `dev.db` 中现在有 4 条兴趣卡片数据，首页可以查询并展示了。

---

## 5. Prisma Client 适配器更新

**旧代码（阶段一）：**

```tsx
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const adapter = new PrismaLibSQL(libsql);
```

**新代码（当前）：**

```tsx
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
```

**变化点：**

| | 旧代码 | 新代码 |
|----|--------|--------|
| 导入 | `import { createClient } from "@libsql/client"` | 不需要了 |
| 适配器类 | `PrismaLibSQL` | `PrismaLibSql`（注意大小写） |
| 初始化 | 先创建 `libsql` 客户端，再传给适配器 | 直接把配置传给 `PrismaLibSql` |

新版本简化了代码，不再需要手动创建 libsql 客户端。Prisma 7.8 的新适配器 API 直接接受配置对象。

---

## 6. 知识检查清单

学习完本文档后，你应该能回答以下问题：

**TypeScript**
- [ ] `interface` 的作用是什么？
- [ ] `Record<K, V>` 是什么类型？
- [ ] 为什么 InterestGrid 的 interface 只有 5 个字段，而数据库有 7 个？

**数据查询**
- [ ] `async function HomePage()` 为什么可以在组件里用 `await`？
- [ ] `prisma.interest.findMany()` 做了什么？
- [ ] `where: { active: true }` 对应什么 SQL？
- [ ] `orderBy: { order: "asc" }` 的作用是什么？

**Framer Motion**
- [ ] `whileInView` 和 `animate` 有什么区别？
- [ ] `viewport={{ once: true }}` 的作用是什么？
- [ ] `transition={{ delay: index * 0.1 }}` 实现了什么效果？

**Tailwind CSS**
- [ ] `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` 在不同屏幕下的表现？
- [ ] 模板字符串拼接 className 和 `cn()` 有什么区别？

**种子数据**
- [ ] 为什么要先 `deleteMany()` 再 `create()`？
- [ ] `tsx` 和 `node` 有什么区别？
- [ ] `.finally()` 在什么时候执行？

---

> **文档版本**：v1.0  
> **对应代码版本**：commit `4984ca7`（feat: add InterestGrid block with database data）  
> **编写日期**：2026-05-26
