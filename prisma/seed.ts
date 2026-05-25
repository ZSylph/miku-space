import { prisma } from "../lib/prisma";

async function main() {
  // Clear existing interests first to avoid duplicates on re-runs
  await prisma.interest.deleteMany();

  const interests = [
    { title: "前端开发", description: "React, Next.js, TypeScript", icon: "Code", color: "bg-blue-100 text-blue-700", order: 0, active: true },
    { title: "设计", description: "UI/UX, Figma, 动画", icon: "Palette", color: "bg-pink-100 text-pink-700", order: 1, active: true },
    { title: "阅读", description: "技术书籍, 科幻小说", icon: "BookOpen", color: "bg-green-100 text-green-700", order: 2, active: true },
    { title: "摄影", description: "街头摄影, 风景", icon: "Camera", color: "bg-amber-100 text-amber-700", order: 3, active: true },
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
