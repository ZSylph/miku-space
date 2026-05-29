import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { noteUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    return ApiResponse.notFound();
  }

  return ApiResponse.ok(note);
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
    const parsed = noteUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, content, category, coverUrl, published } = parsed.data;

    if (slug) {
      const existing = await prisma.note.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return ApiResponse.conflict("Slug already exists");
      }
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;
    if (category !== undefined) data.category = category;
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (published !== undefined) data.published = published;

    const note = await prisma.note.update({ where: { id }, data });
    return ApiResponse.ok(note);
  } catch {
    return ApiResponse.serverError("Failed to update note");
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
    await prisma.note.update({
      where: { id },
      data: { tags: { set: [] } },
    });
    await prisma.note.delete({ where: { id } });
    return ApiResponse.ok({ success: true });
  } catch {
    return ApiResponse.serverError("Failed to delete note");
  }
}
