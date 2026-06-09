import type { LyricLine } from "@/lib/types";

export function lyricsToText(lyrics: LyricLine[]): string {
  if (!lyrics.length) return "";
  const hasTimestamps = lyrics.some((l) => l.time > 0);
  if (!hasTimestamps) {
    return lyrics.map((l) => l.text).join("\n");
  }
  return lyrics
    .map((l) => {
      const m = Math.floor(l.time / 60);
      const s = Math.floor(l.time % 60);
      const ms = Math.round((l.time % 1) * 100);
      return `[${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}]${l.text}`;
    })
    .join("\n");
}

export function parseLyrics(text: string): LyricLine[] {
  if (!text.trim()) return [];
  const lines = text.trim().split("\n");
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const ms = match[3] ? parseInt(match[3].padEnd(3, "0")) : 0;
      const time = minutes * 60 + seconds + ms / 1000;
      const lyricText = match[4].trim();
      if (lyricText) {
        result.push({ time, text: lyricText });
      }
    } else {
      const trimmed = line.trim();
      if (trimmed) {
        result.push({ time: 0, text: trimmed });
      }
    }
  }
  return result;
}
