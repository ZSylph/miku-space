import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { interestCreateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const interests = await prisma.interest.findMany({
    orderBy: { order: "asc" },
  });

  return ApiResponse.ok(interests);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = interestCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, description, icon, color, order, active } = parsed.data;

    const interest = await prisma.interest.create({
      data: {
        title,
        description,
        icon,
        color,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return ApiResponse.created(interest);
  } catch (err) {
    console.error("[interests:POST] Failed to create interest:", err);
    return ApiResponse.serverError("Failed to create interest");
  }
}
