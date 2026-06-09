import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { workUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";
import { cleanupReplacedFile, deleteUploadFile } from "@/lib/file-cleanup";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });

  if (!work) {
    return ApiResponse.notFound();
  }

  return ApiResponse.ok(work);
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
    const parsed = workUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, description, coverUrl, repoUrl, techStack, featured } = parsed.data;

    if (slug) {
      const existing = await prisma.work.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return ApiResponse.conflict("Slug 已存在");
      }
    }

    // Fetch old record for file cleanup
    const oldWork = await prisma.work.findUnique({ where: { id } });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (repoUrl !== undefined) data.repoUrl = repoUrl;
    if (techStack !== undefined) data.techStack = JSON.stringify(techStack);
    if (featured !== undefined) data.featured = featured;

    const work = await prisma.work.update({ where: { id }, data });

    // Clean up replaced cover file
    if (oldWork && coverUrl !== undefined) {
      await cleanupReplacedFile(oldWork.coverUrl, work.coverUrl);
    }

    return ApiResponse.ok(work);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("作品不存在");
    }
    console.error("[works:PUT] Failed to update work:", err);
    return ApiResponse.serverError("更新作品失败");
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
    const work = await prisma.work.findUnique({ where: { id } });
    if (!work) {
      return ApiResponse.notFound("作品不存在");
    }

    await prisma.work.delete({ where: { id } });

    // Clean up cover file
    await deleteUploadFile(work.coverUrl);

    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("作品不存在");
    }
    console.error("[works:DELETE] Failed to delete work:", err);
    return ApiResponse.serverError("删除作品失败");
  }
}
