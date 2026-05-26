import { prisma } from "../lib/prisma";

async function main() {
  await prisma.work.deleteMany();

  const works = [
    {
      title: "个人博客系统",
      slug: "personal-blog",
      description: "基于 Next.js 的全栈博客系统",
      content: "# 个人博客系统\n\n这是一个全栈项目，使用 Next.js + Prisma + PostgreSQL 构建...",
      featured: true,
      order: 0,
      demoUrl: "https://example.com",
      repoUrl: "https://github.com",
    },
    {
      title: "待办事项应用",
      slug: "todo-app",
      description: "简洁优雅的待办管理工具",
      content: "# 待办事项应用\n\n使用 React + TypeScript 构建...",
      featured: true,
      order: 1,
    },
    {
      title: "天气预报小程序",
      slug: "weather-mini-app",
      description: "实时天气查询与预警",
      content: "# 天气预报小程序\n\n接入第三方天气 API...",
      featured: false,
      order: 2,
    },
  ];

  for (const work of works) {
    await prisma.work.create({ data: work });
  }

  console.log("Works seeded:", works.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
