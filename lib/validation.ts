import { z } from "zod";

const urlOrEmpty = z
  .string()
  .max(2048)
  .refine(
    (val) =>
      val === "" ||
      val.startsWith("/") ||
      /^https?:\/\/.+/.test(val),
    "URL 格式不正确"
  )
  .optional()
  .or(z.literal(""));

const slugSchema = z
  .string()
  .min(1, "Slug 不能为空")
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和短横线");

export const postCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  content: z.string().min(1, "内容不能为空").max(100_000),
  tags: z.array(z.string().max(50)).max(20).optional(),
  coverUrl: urlOrEmpty,
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export const noteCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  content: z.string().min(1, "内容不能为空").max(100_000),
  tags: z.array(z.string().max(50)).max(20).optional(),
  coverUrl: urlOrEmpty,
  published: z.boolean().optional(),
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const workCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: slugSchema,
  description: z.string().min(1, "简介不能为空").max(1000),
  coverUrl: urlOrEmpty,
  repoUrl: urlOrEmpty,
  techStack: z.array(z.string().max(50)).max(20).optional(),
  featured: z.boolean().optional(),
});

export const workUpdateSchema = workCreateSchema.partial();

export const reorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ).min(1),
});

export const VALID_COLORS = ["blue", "pink", "green", "purple", "orange", "red", "yellow", "gray"] as const;

export const interestCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100),
  description: z.string().min(1, "描述不能为空").max(500),
  icon: z.string().max(50).optional(),
  color: z.enum(VALID_COLORS).optional(),
  imageUrl: urlOrEmpty,
  active: z.boolean().optional(),
});

export const interestUpdateSchema = interestCreateSchema.partial();

const lyricLineSchema = z.object({
  time: z.number().min(0, "时间不能为负"),
  text: z.string().min(1, "歌词文本不能为空").max(500),
});

export const songCreateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  artist: z.string().min(1, "艺术家不能为空").max(200),
  audioUrl: z.string().min(1, "音频文件不能为空").max(2048),
  coverUrl: urlOrEmpty,
  duration: z.number().int("时长必须是整数").min(0).optional(),
  order: z.number().int("排序序号必须是整数").optional(),
  active: z.boolean().optional(),
  lyrics: z.array(lyricLineSchema).optional(),
});

export const songUpdateSchema = songCreateSchema.partial();
