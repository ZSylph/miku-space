import { z } from "zod";

const urlOrEmpty = z.string().url("URL 格式不正确").max(2048).optional().or(z.literal(""));

const slugSchema = z
  .string()
  .min(1, "Slug 不能为空")
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和短横线");

export const postCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  content: z.string().min(1, "内容不能为空").max(100_000),
  excerpt: z.string().max(500).optional(),
  coverUrl: urlOrEmpty,
  published: z.boolean().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export const noteCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  content: z.string().min(1, "内容不能为空").max(100_000),
  category: z.string().max(100).optional(),
  coverUrl: urlOrEmpty,
  published: z.boolean().optional(),
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const workCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  description: z.string().min(1, "简介不能为空").max(1000),
  content: z.string().max(100_000).optional(),
  coverUrl: urlOrEmpty,
  demoUrl: urlOrEmpty,
  repoUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  order: z.number().int("排序序号必须是整数").optional(),
});

export const workUpdateSchema = workCreateSchema.partial();

export const VALID_COLORS = ["blue", "pink", "green", "purple", "orange", "red", "yellow", "gray"] as const;

export const interestCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100),
  description: z.string().min(1, "描述不能为空").max(500),
  icon: z.string().min(1, "图标不能为空").max(50),
  color: z.string().min(1, "颜色不能为空").refine((c) => VALID_COLORS.includes(c as typeof VALID_COLORS[number]), {
    message: `颜色必须是以下之一: ${VALID_COLORS.join(", ")}`,
  }),
  order: z.number().int("排序序号必须是整数").optional(),
  active: z.boolean().optional(),
});

export const interestUpdateSchema = interestCreateSchema.partial();
