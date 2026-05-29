import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { postCreateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
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
    const { title, slug, content, excerpt, coverUrl, published } = parsed.data;

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return ApiResponse.conflict("Slug already exists");
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverUrl,
        published: published ?? false,
      },
    });

    return ApiResponse.created(post);
  } catch {
    return ApiResponse.serverError("Failed to create post");
  }
}
