export default function AboutPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">关于我</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          你好！我是一名热爱技术的开发者，喜欢探索前端新技术，
          也享受用代码创造有趣的东西。
        </p>
        <h2>技能栈</h2>
        <ul>
          <li>前端：React, Next.js, TypeScript, Tailwind CSS</li>
          <li>后端：Node.js, Prisma, PostgreSQL</li>
          <li>工具：Git, VS Code, Figma</li>
        </ul>
        <h2>联系方式</h2>
        <p>
          欢迎通过邮件或社交媒体与我交流！
        </p>
      </div>
    </div>
  );
}
