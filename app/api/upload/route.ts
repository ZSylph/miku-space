import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return ApiResponse.badRequest("No file provided");
    }

    if (file.size > MAX_FILE_SIZE) {
      return ApiResponse.badRequest("File size exceeds 5MB limit");
    }

    if (!file.type.startsWith("image/")) {
      return ApiResponse.badRequest("Only image files are allowed");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedExts.includes(ext)) {
      return ApiResponse.badRequest("Invalid file extension");
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `${timestamp}-${random}.${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return ApiResponse.ok({ url: `/uploads/${filename}` });
  } catch {
    return ApiResponse.serverError("Upload failed");
  }
}
