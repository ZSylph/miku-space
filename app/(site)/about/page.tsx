import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import {
  Mail,
  MapPin,
  Code2,
  Palette,
  Terminal,
  Sparkles,
  Heart,
  BookOpen,
  Layers,
  Globe,
} from "lucide-react";

/* ── Data ── */

const skills = [
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Terminal },
  { name: "TypeScript", icon: Code2 },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Node.js", icon: Terminal },
  { name: "Prisma", icon: Layers },
];

const socialLinks = [
  {
    label: "GitHub",
    href: siteConfig.social.github,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Bilibili",
    href: siteConfig.social.bilibili,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.social.email}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const techStack = [
  { label: "前端框架", value: "Next.js 16", icon: Globe },
  { label: "样式方案", value: "Tailwind CSS v4", icon: Palette },
  { label: "UI 组件", value: "shadcn/ui", icon: Layers },
  { label: "数据库", value: "Prisma + SQLite", icon: BookOpen },
];

/* ── Shared styles ── */

const glassCard = cn(
  "rounded-3xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
  "transition-[background-color,border-color] duration-300",
);

/* ── Component ── */

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* ══════ Banner ══════ */}
      <div className="relative rounded-3xl overflow-hidden h-70 md:h-85">
        <Image
          src="/zsxy.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-dark-base/90 via-dark-base/30 to-transparent" />

        {/* Decorative large title */}
        <span className="absolute bottom-4 left-6 text-[56px] md:text-[72px] font-black text-white/8 leading-none select-none pointer-events-none">
          ABOUT
        </span>
      </div>

      {/* ══════ Profile card ══════ */}
      <div className={cn(glassCard, "px-6 md:px-8 py-6 -mt-16 relative z-10")}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 ring-[3px] ring-miku-primary/30 shadow-[0_4px_20px_rgba(168,230,225,0.25)] -mt-16 bg-dark-base">
            <Image
              src="/zsxy.jpg"
              alt="头像"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">玖驻zsxy</h1>
            <p className="text-[11px] text-miku-primary tracking-[0.2em] uppercase mt-1 font-medium">
              Designer / Developer / Otaku
            </p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3 h-3" />
              中国
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-lg">
              热爱技术的开发者，喜欢探索前端新技术，也享受用代码创造有趣的东西。
              这个站点是我的个人空间，记录学习、分享思考、展示作品。
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 shrink-0">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  "bg-light-card text-muted-foreground",
                  "hover:text-miku-primary hover:bg-light-border transition-all duration-200",
                )}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ Introduction ══════ */}
      <div className={cn(glassCard, "p-6 md:p-8")}>
        <SectionTitle
          icon={<Sparkles className="w-4 h-4" />}
          label="个人简介"
        />

        <div className="text-sm text-muted-foreground leading-[1.9] space-y-3">
          <p>
            你好，我是
            <strong className="text-foreground font-semibold">玖驻zsxy</strong>
            。
          </p>
          <p>
            专注于前端开发、设计与技术的交叉领域。热衷于用代码构建有温度的产品，
            在工程实践与视觉表达之间寻找平衡。从交互原型到系统架构，
            享受每一次从零到一的创造过程。
          </p>
          <p>
            工作之余，我喜欢研究开源项目、写技术博客、收集设计灵感。
            相信好的工具应该是透明的——让人专注于创造本身，而非技术的复杂性。
          </p>
        </div>
      </div>

      {/* ══════ Skills + Site Info (2-col) ══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tech stack */}
        <div className={cn(glassCard, "p-6")}>
          <SectionTitle icon={<Code2 className="w-4 h-4" />} label="技术栈" />

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px]",
                  "bg-light-border text-foreground",
                  "border border-light-border",
                  "dark:bg-dark-card dark:border-dark-card-hover",
                )}
              >
                <skill.icon className="w-3.5 h-3.5 text-miku-primary-dark" />
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Site info */}
        <div className={cn(glassCard, "p-6")}>
          <SectionTitle icon={<Heart className="w-4 h-4" />} label="关于本站" />

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Miku Space</strong>{" "}
            以初音未来为设计灵感，
            青绿为主色调，毛玻璃效果搭配流畅动画，营造梦幻、清新的个人空间。
          </p>

          <div className="grid grid-cols-2 gap-2">
            {techStack.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-light-card dark:bg-dark-card p-2.5"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <item.icon className="w-3 h-3 text-miku-primary-dark" />
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ Contact ══════ */}
      <div className={cn(glassCard, "p-6 md:p-8")}>
        <SectionTitle icon={<Mail className="w-4 h-4" />} label="联系方式" />

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          欢迎通过邮件或社交媒体与我交流。无论是技术讨论、项目合作，
          还是单纯想聊聊天，都很期待收到你的消息。
        </p>

        <Link
          href={`mailto:${siteConfig.social.email}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium",
            "bg-miku-primary text-dark-base",
            "hover:shadow-[0_4px_20px_rgba(168,230,225,0.35)] transition-all duration-200",
          )}
        >
          <Mail className="w-4 h-4" />
          发送邮件
        </Link>
      </div>
    </div>
  );
}

/* ── Section title with icon + gradient line ── */
function SectionTitle({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="text-miku-primary-dark">{icon}</span>
      <h2 className="text-base font-bold text-foreground">{label}</h2>
      <div className="flex-1 h-px bg-linear-to-r from-[rgba(168,230,225,0.2)] to-transparent" />
    </div>
  );
}
