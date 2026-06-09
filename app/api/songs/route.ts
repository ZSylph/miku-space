import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { songCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const url = new URL(request.url);
  const activeOnly = url.searchParams.get("active") === "true";

  const songs = await prisma.song.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: "asc" },
  });

  return ApiResponse.ok(songs);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Parse lyrics JSON string to array if it's a string
    if (typeof body.lyrics === "string") {
      try {
        body.lyrics = JSON.parse(body.lyrics);
      } catch {
        return ApiResponse.badRequest("歌词 JSON 格式无效");
      }
    }

    const parsed = songCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const { lyrics, ...rest } = parsed.data;

    // Auto-assign order: append to end
    const maxOrder = await prisma.song.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const song = await prisma.song.create({
      data: {
        ...rest,
        order: rest.order ?? nextOrder,
        lyrics: lyrics ? JSON.stringify(lyrics) : null,
      },
    });

    return ApiResponse.created(song);
  } catch (err) {
    console.error("[songs] Create failed:", err);
    return ApiResponse.serverError("创建歌曲失败");
  }
}
