import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { reorderSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest("Invalid reorder data");
    }

    await prisma.$transaction(
      parsed.data.orders.map((item) =>
        prisma.work.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return ApiResponse.ok({ success: true });
  } catch (err) {
    console.error("[works/reorder] Failed:", err);
    return ApiResponse.serverError("排序更新失败");
  }
}
