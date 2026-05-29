import { z } from "zod";

const urlOrEmpty = z.string().url("URL 格式不正确").optional().or(z.literal(""));

export const postCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().optional(),
  coverUrl: urlOrEmpty,
  published: z.boolean().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export const noteCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空"),
  content: z.string().min(1, "内容不能为空"),
  category: z.string().optional(),
  coverUrl: urlOrEmpty,
  published: z.boolean().optional(),
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const workCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空"),
  description: z.string().min(1, "简介不能为空"),
  content: z.string().optional(),
  coverUrl: urlOrEmpty,
  demoUrl: urlOrEmpty,
  repoUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  order: z.number().int("排序序号必须是整数").optional(),
});

export const workUpdateSchema = workCreateSchema.partial();

export const interestCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().min(1, "描述不能为空"),
  icon: z.string().min(1, "图标不能为空"),
  color: z.string().min(1, "颜色不能为空"),
  order: z.number().int("排序序号必须是整数").optional(),
  active: z.boolean().optional(),
});

export const interestUpdateSchema = interestCreateSchema.partial();
