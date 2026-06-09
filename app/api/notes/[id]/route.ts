import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { noteUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";
import { cleanupReplacedFile, deleteUploadFile } from "@/lib/file-cleanup";

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
    const { title, slug, content, tags, coverUrl, published } = parsed.data;

    if (slug) {
      const existing = await prisma.note.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return ApiResponse.conflict("Slug 已存在");
      }
    }

    // Fetch old record for file cleanup
    const oldNote = await prisma.note.findUnique({ where: { id } });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;
    if (tags !== undefined) data.tags = JSON.stringify(tags);
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (published !== undefined) data.published = published;

    const note = await prisma.note.update({ where: { id }, data });

    // Clean up replaced cover file
    if (oldNote && coverUrl !== undefined) {
      await cleanupReplacedFile(oldNote.coverUrl, note.coverUrl);
    }

    return ApiResponse.ok(note);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("笔记不存在");
    }
    console.error("[notes:PUT] Failed to update note:", err);
    return ApiResponse.serverError("更新笔记失败");
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
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return ApiResponse.notFound("笔记不存在");
    }

    await prisma.note.delete({ where: { id } });

    // Clean up cover file
    await deleteUploadFile(note.coverUrl);

    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("笔记不存在");
    }
    console.error("[notes:DELETE] Failed to delete note:", err);
    return ApiResponse.serverError("删除笔记失败");
  }
}
