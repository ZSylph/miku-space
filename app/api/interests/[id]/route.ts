import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { interestUpdateSchema } from "@/lib/validation";
import { ApiResponse } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  const interest = await prisma.interest.findUnique({ where: { id } });

  if (!interest) {
    return ApiResponse.notFound();
  }

  return ApiResponse.ok(interest);
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
    const parsed = interestUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(parsed.error.issues[0].message);
    }
    const { title, description, icon, color, order, active } = parsed.data;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (icon !== undefined) data.icon = icon;
    if (color !== undefined) data.color = color;
    if (order !== undefined) data.order = order;
    if (active !== undefined) data.active = active;

    const interest = await prisma.interest.update({ where: { id }, data });
    return ApiResponse.ok(interest);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("Interest not found");
    }
    console.error("[interests:PUT] Failed to update interest:", err);
    return ApiResponse.serverError("Failed to update interest");
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
    await prisma.interest.delete({ where: { id } });
    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      return ApiResponse.notFound("Interest not found");
    }
    console.error("[interests:DELETE] Failed to delete interest:", err);
    return ApiResponse.serverError("Failed to delete interest");
  }
}
