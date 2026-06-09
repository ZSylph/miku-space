import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface WorkCardProps {
  title: string;
  description: string;
  coverUrl?: string | null;
  repoUrl?: string | null;
  techStack?: string[];
}

export default function WorkCard({
  title,
  description,
  coverUrl,
  repoUrl,
  techStack = [],
}: WorkCardProps) {
  const href = repoUrl || "#";

  return (
    <div className="group flex flex-col h-full rounded-2xl overflow-hidden border bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)] dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors duration-300">
      {/* Cover area — links to repo */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[2/1] overflow-hidden"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-miku-primary/20 to-miku-primary-light/10 flex items-center justify-center">
            <span className="text-3xl select-none opacity-40">🚀</span>
          </div>
        )}

        {/* GitHub icon — top right */}
        <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-dark-base/50 backdrop-blur-sm flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-dark-base/70 transition-all">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </span>
      </a>

      {/* Content area */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col flex-1">
        {/* Title — links to repo */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-foreground group-hover:text-miku-primary transition-colors duration-200 flex items-center gap-1.5"
        >
          {title}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
        </a>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tech stack tags */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(168,230,225,0.12)] text-miku-primary-dark dark:bg-[rgba(168,230,225,0.08)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
