import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { workCreateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const works = await prisma.work.findMany({
    orderBy: { order: "asc" },
  });

  return ApiResponse.ok(works);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = workCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, slug, description, content, coverUrl, demoUrl, repoUrl, featured, order } = parsed.data;

    const existing = await prisma.work.findUnique({ where: { slug } });
    if (existing) {
      return ApiResponse.conflict("Slug already exists");
    }

    const work = await prisma.work.create({
      data: {
        title,
        slug,
        description,
        content,
        coverUrl,
        demoUrl,
        repoUrl,
        featured: featured ?? false,
        order: order ?? 0,
      },
    });

    return ApiResponse.created(work);
  } catch (err) {
    console.error("[works:POST] Failed to create work:", err);
    return ApiResponse.serverError("Failed to create work");
  }
}
