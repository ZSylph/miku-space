import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  category?: string | null;
  tags?: string[];
  createdAt: Date;
}

interface ContentCardProps {
  item: ContentItem;
  href: string;
  variant?: "grid" | "list";
  showExcerpt?: boolean;
  showTags?: boolean;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function CoverPlaceholder({ emoji, className }: { emoji: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-miku-primary to-miku-primary-light",
        className
      )}
    >
      <span className="text-2xl select-none">{emoji}</span>
    </div>
  );
}

export default function ContentCard({
  item,
  href,
  variant = "grid",
  showExcerpt = true,
  showTags = false,
}: ContentCardProps) {
  const displayText = item.description;

  if (variant === "list") {
    return (
      <Link href={href} className="group block">
        <div
          className={cn(
            "flex flex-row gap-4 rounded-[20px] p-4",
            "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
            "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
            "transition-[background-color,border-color,box-shadow,transform] duration-300",
            "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
          )}
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
            {item.coverUrl ? (
              <Image
                src={item.coverUrl}
                alt={item.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <CoverPlaceholder emoji="📝" className="w-full h-full rounded-xl" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h3
              className={cn(
                "font-semibold text-base truncate",
                "transition-colors duration-200 group-hover:text-miku-primary"
              )}
            >
              {item.title}
            </h3>

            {showExcerpt && displayText && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {displayText}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {showTags && item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(168,230,225,0.12)] text-miku-primary-dark dark:bg-[rgba(168,230,225,0.08)]"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 4 && (
                    <span className="text-[10px] text-muted-foreground/50">+{item.tags.length - 4}</span>
                  )}
                </div>
              )}
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant
  return (
    <Link href={href} className="group block h-full">
      <div
        className={cn(
          "rounded-[20px] overflow-hidden h-full flex flex-col",
          "bg-[rgba(255,255,255,0.65)] backdrop-blur-xl border border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]",
          "transition-[background-color,border-color,box-shadow,transform] duration-300",
          "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,230,225,0.12)]"
        )}
      >
        {/* Cover */}
        <div
          className="relative w-full overflow-hidden aspect-square"
        >
          {item.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CoverPlaceholder emoji="🚀" className="w-full h-full" />
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3
            className={cn(
              "font-semibold text-base",
              "transition-colors duration-200 group-hover:text-miku-primary"
            )}
          >
            {item.title}
          </h3>

          {showExcerpt && displayText && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {displayText}
            </p>
          )}

          <div className="flex items-center gap-2 mt-auto pt-3 flex-wrap">
            {showTags && item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {item.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(168,230,225,0.12)] text-miku-primary-dark dark:bg-[rgba(168,230,225,0.08)]"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 4 && (
                  <span className="text-[10px] text-muted-foreground/50">+{item.tags.length - 4}</span>
                )}
              </div>
            )}
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
