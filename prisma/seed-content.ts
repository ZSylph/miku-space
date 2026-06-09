import { prisma } from "../lib/prisma";

async function main() {
  await prisma.post.deleteMany();
  await prisma.note.deleteMany();

  const post = await prisma.post.create({
    data: {
      title: "我的第一篇技术文章",
      slug: "my-first-post",
      content: "# 我的第一篇技术文章\n\n这是关于 Next.js 和 React 的学习笔记。\n\n## 为什么选 Next.js\n\nNext.js 提供了出色的开发体验...\n\n## 核心概念\n\n- **App Router**: 基于文件系统的路由\n- **Server Components**: 减少客户端 JavaScript\n- **ISR**: 增量静态再生成",
      tags: JSON.stringify(["前端", "Next.js", "React"]),
      published: true,
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "TypeScript 学习笔记",
      slug: "typescript-notes",
      content: "# TypeScript 学习笔记\n\n## 类型断言\n\n```typescript\nconst value = someValue as string;\n```\n\n## 泛型\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```",
      tags: JSON.stringify(["前端", "TypeScript"]),
      published: true,
    },
  });

  console.log("Content seeded:", { post: post.title, note: note.title });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
