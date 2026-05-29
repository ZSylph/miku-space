import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
}

interface ContentDetailProps {
  title: string;
  content: string;
  coverUrl?: string | null;
  excerpt?: string | null;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
  extra?: React.ReactNode;
  prev?: NavItem | null;
  next?: NavItem | null;
}

export default function ContentDetail({
  title,
  content,
  coverUrl,
  excerpt,
  backHref,
  backLabel,
  meta,
  extra,
  prev,
  next,
}: ContentDetailProps) {
  return (
    <article className="max-w-4xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      {/* 返回链接 */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-miku-primary transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      {/* 封面图（可选） */}
      {coverUrl && (
        <div className="relative w-full h-[200px] md:h-[320px] rounded-3xl overflow-hidden mb-6">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.3)] to-transparent" />
        </div>
      )}

      {/* 毛玻璃标题区 */}
      <div
        className={cn(
          "rounded-3xl p-7 mb-6",
          "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <h1 className="text-[32px] font-bold text-foreground leading-tight mb-4">
          {title}
        </h1>
        {meta && <div className="flex items-center gap-2">{meta}</div>}
      </div>

      {/* 摘要引用块（可选） */}
      {excerpt && (
        <div
          className={cn(
            "rounded-2xl p-5 mb-6",
            "border-l-[3px] border-miku-primary",
            "bg-[rgba(168,230,225,0.08)]"
          )}
        >
          <p className="text-base text-muted-foreground leading-relaxed">
            {excerpt}
          </p>
        </div>
      )}

      {/* 额外内容（可选） */}
      {extra && <div className="mb-6">{extra}</div>}

      {/* 毛玻璃 Markdown 正文区 */}
      <div
        className={cn(
          "rounded-3xl p-7 md:p-10",
          "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>

      {/* 上一篇/下一篇导航（可选） */}
      {(prev || next) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {/* 上一篇 */}
          {prev ? (
            <Link
              href={prev.href}
              className={cn(
                "group flex flex-col rounded-2xl p-5",
                "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
              )}
            >
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                上一篇
              </span>
              <span className="text-foreground font-medium line-clamp-1">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {/* 下一篇 */}
          {next ? (
            <Link
              href={next.href}
              className={cn(
                "group flex flex-col items-end rounded-2xl p-5",
                "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
                "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
              )}
            >
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-1">
                下一篇
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-foreground font-medium line-clamp-1 text-right">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </article>
  );
}
