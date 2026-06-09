"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  /** 文章/笔记的完整 URL */
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "微博",
      href: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.622.275.821.971.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.19.573h.004zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.642 4.318-.341 5.132-2.145.8-1.752-.145-3.658-2.161-4.183zM17.431 4.693l-1.26.262c-.137.028-.211.173-.168.321.043.149.194.248.33.219l1.261-.262c.508-.105 1.012.192 1.123.662l.262 1.261c.028.136.173.211.321.168.148-.043.248-.194.219-.33l-.262-1.261c-.176-.749-.977-1.228-1.826-1.04zM20.734 6.171l-.523.109c-.136.028-.21.173-.168.321.043.149.195.248.331.219l.522-.108c.237-.05.47.099.522.331l.108.522c.028.136.174.211.321.168.148-.043.249-.194.219-.33l-.108-.522c-.1-.506-.608-.831-1.224-.71zM17.111 2.601c-.137.028-.211.174-.168.321.043.149.194.248.33.219.812-.168 1.627.12 2.123.751.497.63.586 1.462.233 2.175-.063.128-.011.283.117.347.128.063.283.011.346-.117.46-.932.345-2.019-.302-2.84-.648-.821-1.713-1.222-2.779-.996l.1-.16zM19.921 1.529c-.136.028-.21.174-.168.321.043.148.195.248.331.219 1.328-.276 2.66.197 3.476 1.231.816 1.033.96 2.393.382 3.557-.063.128-.011.283.117.346.128.063.283.012.346-.117.697-1.399.523-3.039-.465-4.286-.987-1.248-2.6-1.835-4.119-1.507l.1-.264z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground/50 mr-1">分享</span>
      {shareLinks.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`分享到 ${label}`}
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
            "bg-[rgba(168,230,225,0.08)] text-muted-foreground/60",
            "hover:text-miku-primary hover:bg-[rgba(168,230,225,0.2)] hover:scale-105",
          )}
        >
          {icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="复制链接"
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
          "bg-[rgba(168,230,225,0.08)] text-muted-foreground/60",
          "hover:text-miku-primary hover:bg-[rgba(168,230,225,0.2)] hover:scale-105",
          copied && "!text-miku-primary",
        )}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
