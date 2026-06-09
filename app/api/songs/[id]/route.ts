import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { songUpdateSchema } from "@/lib/validation";
import { cleanupReplacedFile, deleteUploadFile } from "@/lib/file-cleanup";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id } = await params;

    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      return ApiResponse.notFound("歌曲不存在");
    }

    return ApiResponse.ok(song);
  } catch (err: unknown) {
    console.error("[songs] GET failed:", err);
    return ApiResponse.serverError("获取歌曲失败");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id } = await params;

    // Fetch old record to detect replaced files
    const oldSong = await prisma.song.findUnique({ where: { id } });
    if (!oldSong) {
      return ApiResponse.notFound("歌曲不存在");
    }

    const body = await request.json();

    // Parse lyrics JSON string to array if it's a string
    if (typeof body.lyrics === "string") {
      try {
        body.lyrics = JSON.parse(body.lyrics);
      } catch {
        return ApiResponse.badRequest("歌词 JSON 格式无效");
      }
    }

    const parsed = songUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const { lyrics, ...rest } = parsed.data;

    const song = await prisma.song.update({
      where: { id },
      data: {
        ...rest,
        lyrics: lyrics !== undefined
          ? (lyrics ? JSON.stringify(lyrics) : null)
          : undefined,
      },
    });

    // Clean up replaced files
    await cleanupReplacedFile(oldSong.audioUrl, song.audioUrl);
    await cleanupReplacedFile(oldSong.coverUrl, song.coverUrl);

    return ApiResponse.ok(song);
  } catch (err: unknown) {
    console.error("[songs] Update failed:", err);
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("歌曲不存在");
    }
    return ApiResponse.serverError("更新歌曲失败");
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

    // Fetch record first to know which files to clean up
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      return ApiResponse.notFound("歌曲不存在");
    }

    await prisma.song.delete({ where: { id } });

    // Clean up associated files (only if not still used by another record)
    await deleteUploadFile(song.audioUrl);
    await deleteUploadFile(song.coverUrl);

    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    console.error("[songs] Delete failed:", err);
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("歌曲不存在");
    }
    return ApiResponse.serverError("删除歌曲失败");
  }
}
