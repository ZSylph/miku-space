import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ── Markdown utilities ── */

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Extract headings (h1–h3) from markdown content for TOC generation.
 *  Strips code blocks and blockquote lines first to avoid false matches. */
export function extractHeadings(content: string): TocItem[] {
  // 1. Remove fenced code blocks (```...```)
  let cleaned = content.replace(/```[\s\S]*?```/g, "");
  // 2. Remove inline code
  cleaned = cleaned.replace(/`[^`]*`/g, "");
  // 3. Remove blockquote lines (lines starting with optional whitespace + >)
  cleaned = cleaned.replace(/^\s*>.*$/gm, "");

  const headings: TocItem[] = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
    if (!text) continue;
    headings.push({
      id: slugify(text),
      text,
      level: match[1].length,
    });
  }
  return headings;
}

/** Count words in mixed Chinese/English content.
 *  Keeps code block content (including comments) — only strips markdown syntax. */
export function countWords(content: string): number {
  const stripped = content
    .replace(/^#{1,6}\s+/gm, "")              // heading markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // links → visible text
    .replace(/[*_~>|`!]/g, "")                 // formatting chars
    .replace(/---+/g, "")                      // horizontal rules
    .replace(/\n+/g, " ")
    .trim();
  const chinese = (stripped.match(/[\u4e00-\u9fff]/g) || []).length;
  const english = (
    stripped
      .replace(/[\u4e00-\u9fff]/g, " ")
      .match(/[a-zA-Z0-9]+/g) || []
  ).length;
  return chinese + english;
}

/** Generate URL-safe slug from text (matches GitHub-style heading anchors) */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseTags(raw: string): string[] {
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

/** Generate URL-safe slug from title text */
export function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Estimate reading time in minutes for mixed Chinese/English content.
 *  ~400 chars/min for Chinese, ~200 words/min for English. */
export function readingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 400));
}

/** Strip markdown syntax for plain-text descriptions. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "")          // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")     // links → text
    .replace(/#{1,6}\s+/g, "")                  // headings
    .replace(/[*_~`]+/g, "")                    // emphasis
    .replace(/>\s+/g, "")                       // blockquotes
    .replace(/\n{2,}/g, "\n")                   // blank lines
    .trim();
}

/** Truncate text to a maximum length, breaking at word boundary. */
export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}
