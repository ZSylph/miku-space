import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { workUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

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
    const { title, slug, description, content, coverUrl, demoUrl, repoUrl, featured, order } = parsed.data;

    if (slug) {
      const existing = await prisma.work.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return ApiResponse.conflict("Slug already exists");
      }
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (content !== undefined) data.content = content;
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (demoUrl !== undefined) data.demoUrl = demoUrl;
    if (repoUrl !== undefined) data.repoUrl = repoUrl;
    if (featured !== undefined) data.featured = featured;
    if (order !== undefined) data.order = order;

    const work = await prisma.work.update({ where: { id }, data });
    return ApiResponse.ok(work);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("Work not found");
    }
    console.error("[works:PUT] Failed to update work:", err);
    return ApiResponse.serverError("Failed to update work");
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
    await prisma.work.delete({ where: { id } });
    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("Work not found");
    }
    console.error("[works:DELETE] Failed to delete work:", err);
    return ApiResponse.serverError("Failed to delete work");
  }
}
