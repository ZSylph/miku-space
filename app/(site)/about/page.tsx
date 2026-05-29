import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Mail, GitBranch, AtSign, MapPin, Code2, Palette, Terminal, Sparkles } from "lucide-react";

const skills = [
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Terminal },
  { name: "TypeScript", icon: Code2 },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Node.js", icon: Terminal },
  { name: "Prisma", icon: DatabaseIcon },
];

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

const socialLinks = [
  { href: "mailto:hello@example.com", icon: Mail, label: "Email" },
  { href: "https://github.com", icon: GitBranch, label: "GitHub" },
  { href: "https://twitter.com", icon: AtSign, label: "Twitter" },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[28px] font-bold text-foreground">关于我</h1>
        <p className="text-sm text-muted-foreground mt-1">
          了解这个站点背后的开发者
        </p>
      </div>

      {/* Profile Card */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6 md:p-8",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 ring-2 ring-miku-primary/30">
            <Image
              src="/zsxy.jpg"
              alt="Avatar"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-foreground">玖驻零时</h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              中国
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              热爱技术的开发者，喜欢探索前端新技术，也享受用代码创造有趣的东西。
              这个站点是我的个人空间，记录学习、分享思考、展示作品。
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                    "bg-secondary text-secondary-foreground",
                    "hover:bg-miku-primary/20 transition-colors"
                  )}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6 md:p-8",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-miku-primary-dark" />
          <h2 className="text-lg font-bold text-foreground">技术栈</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm",
                "bg-[rgba(168,230,225,0.12)] text-foreground",
                "border border-[rgba(168,230,225,0.2)]",
                "dark:bg-[rgba(168,230,225,0.08)] dark:border-[rgba(168,230,225,0.12)]"
              )}
            >
              <skill.icon className="w-3.5 h-3.5 text-miku-primary-dark" />
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6 md:p-8",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h2 className="text-lg font-bold text-foreground mb-3">联系方式</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          欢迎通过邮件或社交媒体与我交流！无论是技术讨论、项目合作，还是单纯想聊聊天，都很期待收到你的消息。
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Link
            href="mailto:hello@example.com"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-miku-primary/15 text-foreground",
              "hover:bg-miku-primary/25 transition-colors"
            )}
          >
            <Mail className="w-4 h-4" />
            发送邮件
          </Link>
        </div>
      </div>

      {/* Site Info */}
      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border p-6",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h2 className="text-lg font-bold text-foreground mb-3">关于本站</h2>
        <div className="prose-custom text-sm">
          <p>
            <strong>Miku Space</strong> 是一个使用 Next.js 16 + Tailwind CSS v4 构建的个人博客站点。
            设计风格受到初音未来的启发，以青绿色为主色调，搭配毛玻璃效果和流畅的动画过渡，
            营造出一个梦幻、清新的个人空间。
          </p>
          <ul>
            <li>前端框架：Next.js 16 (App Router)</li>
            <li>样式方案：Tailwind CSS v4</li>
            <li>UI 组件：shadcn/ui</li>
            <li>数据库：Prisma + SQLite</li>
            <li>部署：Vercel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
