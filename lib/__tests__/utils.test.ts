import { describe, it, expect } from "vitest";
import {
  makeSlug,
  parseTags,
  formatTime,
  extractHeadings,
  countWords,
  slugify,
  readingTime,
  stripMarkdown,
  truncateText,
} from "../utils";

describe("makeSlug", () => {
  it("converts Chinese title to slug", () => {
    expect(makeSlug("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(makeSlug("Hello, World!!!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(makeSlug("--Hello--")).toBe("hello");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(makeSlug("Hello    World")).toBe("hello-world");
  });
});

describe("parseTags", () => {
  it("parses valid JSON array", () => {
    expect(parseTags('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseTags("invalid")).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseTags("")).toEqual([]);
  });
});

describe("formatTime", () => {
  it("formats seconds to m:ss", () => {
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(600)).toBe("10:00");
  });

  it("handles invalid input", () => {
    expect(formatTime(NaN)).toBe("0:00");
  });
});

describe("extractHeadings", () => {
  it("extracts h1-h3 headings", () => {
    const md = "# Title\n## Subtitle\n### Detail\n#### Ignored";
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ id: "title", text: "Title", level: 1 });
    expect(headings[2]).toEqual({ id: "detail", text: "Detail", level: 3 });
  });

  it("ignores headings inside code blocks", () => {
    const md = "```\n# Code heading\n```\n# Real heading";
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(1);
    expect(headings[0].text).toBe("Real heading");
  });
});

describe("countWords", () => {
  it("counts Chinese characters", () => {
    expect(countWords("你好世界")).toBe(4);
  });

  it("counts English words", () => {
    expect(countWords("hello world")).toBe(2);
  });

  it("counts mixed content", () => {
    // 2 English words + 4 Chinese characters
    expect(countWords("Hello 你好 world 世界")).toBe(6);
  });
});

describe("slugify", () => {
  it("handles Chinese text", () => {
    expect(slugify("你好 World")).toBe("你好-world");
  });
});

describe("readingTime", () => {
  it("returns at least 1 minute", () => {
    expect(readingTime(100)).toBe(1);
  });

  it("calculates minutes for Chinese", () => {
    expect(readingTime(800)).toBe(2);
  });
});

describe("stripMarkdown", () => {
  it("removes images and links", () => {
    expect(stripMarkdown("![alt](url) and [link](url)")).toBe("and link");
  });

  it("removes heading markers", () => {
    expect(stripMarkdown("# Title")).toBe("Title");
  });
});

describe("truncateText", () => {
  it("does not truncate short text", () => {
    expect(truncateText("short", 100)).toBe("short");
  });

  it("truncates long text with ellipsis", () => {
    const text = "a".repeat(200);
    expect(truncateText(text, 50)).toMatch(/…$/);
  });
});
