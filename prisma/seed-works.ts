import { prisma } from "../lib/prisma";

async function main() {
  await prisma.work.deleteMany();

  const works = [
    {
      title: "个人博客系统",
      slug: "personal-blog",
      description: "基于 Next.js 的全栈博客系统",
      featured: true,
      order: 0,
      repoUrl: "https://github.com/zsxy/personal-blog",
    },
    {
      title: "待办事项应用",
      slug: "todo-app",
      description: "简洁优雅的待办管理工具",
      featured: true,
      order: 1,
    },
    {
      title: "天气预报小程序",
      slug: "weather-mini-app",
      description: "实时天气查询与预警",
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
