import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for allowed image formats
const MAGIC_BYTES: Record<string, number[]> = {
  jpg:  [0xFF, 0xD8, 0xFF],
  jpeg: [0xFF, 0xD8, 0xFF],
  png:  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  gif:  [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header (bytes 8-11 should be "WEBP")
};

function matchesMagicBytes(buffer: Buffer): boolean {
  for (const [, magic] of Object.entries(MAGIC_BYTES)) {
    if (buffer.length < magic.length) continue;
    let match = true;
    for (let i = 0; i < magic.length; i++) {
      if (buffer[i] !== magic[i]) { match = false; break; }
    }
    if (match) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (magic[0] === 0x52 && buffer.length >= 12) {
        const webpTag = buffer.subarray(8, 12).toString("ascii");
        if (webpTag !== "WEBP") continue;
      }
      return true;
    }
  }
  return false;
}

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate actual file content via magic bytes
    if (!matchesMagicBytes(buffer)) {
      return ApiResponse.badRequest("Invalid image content — file does not match any allowed format");
    }

    // Detect real format from magic bytes, ignore client-provided extension
    let ext = "jpg";
    if (buffer[0] === 0x89) ext = "png";
    else if (buffer[0] === 0x47) ext = "gif";
    else if (buffer[0] === 0x52) ext = "webp";

    const timestamp = Date.now();
    const random = randomBytes(8).toString("hex");
    const filename = `${timestamp}-${random}.${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return ApiResponse.ok({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload] Upload failed:", err);
    return ApiResponse.serverError("Upload failed");
  }
}
