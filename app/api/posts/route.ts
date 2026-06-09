import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { postCreateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const posts = await prisma.post.findMany({
    orderBy: { order: "asc" },
  });

  return ApiResponse.ok(posts);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = postCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, content, tags, coverUrl, featured, published } = parsed.data;

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return ApiResponse.conflict("Slug 已存在");
    }

    const maxOrder = await prisma.post.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        tags: JSON.stringify(tags ?? []),
        coverUrl,
        featured: featured ?? false,
        published: published ?? false,
        order: nextOrder,
      },
    });

    return ApiResponse.created(post);
  } catch (err) {
    console.error("[posts:POST] Failed to create post:", err);
    return ApiResponse.serverError("创建文章失败");
  }
}
