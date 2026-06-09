import { isValidElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ChevronLeft, FileText } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import type { TocItem } from "@/lib/utils";
import TocSidebar from "./TocSidebar";
import ShareButtons from "./ShareButtons";

interface NavItem {
  title: string;
  href: string;
}

interface ContentDetailProps {
  title: string;
  content: string;
  coverUrl?: string | null;
  backHref: string;
  backLabel: string;
  meta?: ReactNode;
  prev?: NavItem | null;
  next?: NavItem | null;
  wordCount?: number;
  headings?: TocItem[];
  shareUrl?: string;
  shareTitle?: string;
}

/* Recursively extract plain text from React nodes (handles <strong>, <code>, etc.) */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

/* Custom heading renderers that inject id + scroll-margin for TOC anchoring */
function makeHeadingComponent(level: number) {
  return function HeadingComponent({ children }: { children?: ReactNode }) {
    const text = extractText(children).replace(/\n/g, "").trim();
    const id = slugify(text);
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag id={id} className="scroll-mt-20">
        {children}
      </Tag>
    );
  };
}

const mdComponents = {
  h1: makeHeadingComponent(1),
  h2: makeHeadingComponent(2),
  h3: makeHeadingComponent(3),
};

export default function ContentDetail({
  title,
  content,
  coverUrl,
  backHref,
  backLabel,
  meta,
  prev,
  next,
  wordCount,
  headings,
  shareUrl,
  shareTitle,
}: ContentDetailProps) {
  const hasToc = headings && headings.length > 0;

  return (
    <div className="max-w-280 mx-auto py-8 md:py-12 px-4 sm:px-6">
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
        <div className="relative w-full h-50 md:h-80 rounded-3xl overflow-hidden mb-6">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.3)] to-transparent" />
        </div>
      )}

      {/* 两栏布局：文章 + TOC */}
      <div className={cn("grid gap-8", hasToc && "lg:grid-cols-[1fr_220px]")}>
        {/* 文章主区域 */}
        <article className="min-w-0">
          {/* 毛玻璃标题区 */}
          <div
            className={cn(
              "rounded-3xl px-7 pt-6 pb-4 mb-3",
              "bg-light-card backdrop-blur-xl border border-light-border",
              "dark:bg-dark-card dark:border-dark-border",
            )}
          >
            <h1 className="text-[32px] font-bold text-foreground leading-tight mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {meta}
              {wordCount != null && wordCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground/50">
                  <FileText className="w-3.5 h-3.5" />
                  {wordCount} 字
                </span>
              )}
            </div>
          </div>

          {/* 移动端 TOC — 在 lg 以下显示 */}
          {hasToc && (
            <div
              className={cn(
                "rounded-2xl px-5 py-4 mb-3 lg:hidden",
                "bg-light-card backdrop-blur-xl border border-light-border",
                "dark:bg-dark-card dark:border-dark-border",
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-0.75 h-4 rounded-full bg-miku-primary" />
                <h3 className="text-sm font-bold text-foreground tracking-wide">
                  目录
                </h3>
              </div>
              <ul className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={cn(
                        "block text-[13px] leading-snug py-1.5 px-2.5 rounded-md text-muted-foreground/60 hover:text-miku-primary hover:bg-miku-primary/5 transition-colors truncate",
                        h.level === 2 && "pl-6",
                        h.level === 3 && "pl-10",
                      )}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 毛玻璃 Markdown 正文区 */}
          <div
            className={cn(
              "rounded-3xl px-7 md:px-10 pt-5 pb-7 md:pb-10",
              "bg-light-card backdrop-blur-xl border border-light-border",
              "dark:bg-dark-card dark:border-dark-border",
            )}
          >
            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={mdComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>

          {/* 社交分享 */}
          {shareUrl && shareTitle && (
            <div className="mt-6">
              <ShareButtons title={shareTitle} url={shareUrl} />
            </div>
          )}

          {/* 上一篇/下一篇导航（可选） */}
          {(prev || next) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {prev ? (
                <Link
                  href={prev.href}
                  className={cn(
                    "group flex flex-col rounded-2xl p-5",
                    "bg-light-card backdrop-blur-xl border border-light-border",
                    "dark:bg-dark-card dark:border-dark-border",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]",
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

              {next ? (
                <Link
                  href={next.href}
                  className={cn(
                    "group flex flex-col items-end rounded-2xl p-5",
                    "bg-light-card backdrop-blur-xl border border-light-border",
                    "dark:bg-dark-card dark:border-dark-border",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]",
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

        {/* TOC 侧边栏 */}
        {hasToc && (
          <aside className="hidden lg:block">
            <TocSidebar headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
