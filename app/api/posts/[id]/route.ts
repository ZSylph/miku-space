import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { postUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";
import { cleanupReplacedFile, deleteUploadFile } from "@/lib/file-cleanup";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return ApiResponse.notFound();
  }

  return ApiResponse.ok(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = postUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, content, tags, coverUrl, featured, published } = parsed.data;

    if (slug) {
      const existing = await prisma.post.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return ApiResponse.conflict("Slug 已存在");
      }
    }

    // Fetch old record for file cleanup
    const oldPost = await prisma.post.findUnique({ where: { id } });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;
    if (tags !== undefined) data.tags = JSON.stringify(tags);
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (featured !== undefined) data.featured = featured;
    if (published !== undefined) data.published = published;

    const post = await prisma.post.update({ where: { id }, data });

    // Clean up replaced cover file
    if (oldPost && coverUrl !== undefined) {
      await cleanupReplacedFile(oldPost.coverUrl, post.coverUrl);
    }

    return ApiResponse.ok(post);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("文章不存在");
    }
    console.error("[posts:PUT] Failed to update post:", err);
    return ApiResponse.serverError("更新文章失败");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return ApiResponse.notFound("文章不存在");
    }

    await prisma.post.delete({ where: { id } });

    // Clean up cover file
    await deleteUploadFile(post.coverUrl);

    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("文章不存在");
    }
    console.error("[posts:DELETE] Failed to delete post:", err);
    return ApiResponse.serverError("删除文章失败");
  }
}
