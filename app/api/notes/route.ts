import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { noteCreateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ApiResponse.ok(notes);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = noteCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, content, category, coverUrl, published } = parsed.data;

    const existing = await prisma.note.findUnique({ where: { slug } });
    if (existing) {
      return ApiResponse.conflict("Slug already exists");
    }

    const note = await prisma.note.create({
      data: {
        title,
        slug,
        content,
        category,
        coverUrl,
        published: published ?? false,
      },
    });

    return ApiResponse.created(note);
  } catch (err) {
    console.error("[notes:POST] Failed to create note:", err);
    return ApiResponse.serverError("Failed to create note");
  }
}
