import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { cleanupOrphanUploads } from "@/lib/file-cleanup";

export async function POST() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const result = await cleanupOrphanUploads();
    return ApiResponse.ok({
      deleted: result.deleted.length,
      files: result.deleted,
    });
  } catch (err) {
    console.error("[uploads/cleanup] Failed:", err);
    return ApiResponse.serverError("清理失败");
  }
}
