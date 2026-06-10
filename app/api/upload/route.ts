import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { isR2Enabled, uploadToR2 } from "@/lib/r2";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_AUDIO_SIZE = 30 * 1024 * 1024;  // 30MB

// Magic bytes for allowed image formats
const IMAGE_MAGIC: Record<string, number[]> = {
  jpg:  [0xFF, 0xD8, 0xFF],
  jpeg: [0xFF, 0xD8, 0xFF],
  png:  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  gif:  [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46],
};

function matchesImageMagic(buffer: Buffer): boolean {
  for (const [, magic] of Object.entries(IMAGE_MAGIC)) {
    if (buffer.length < magic.length) continue;
    let match = true;
    for (let i = 0; i < magic.length; i++) {
      if (buffer[i] !== magic[i]) { match = false; break; }
    }
    if (match) {
      if (magic[0] === 0x52 && buffer.length >= 12) {
        const webpTag = buffer.subarray(8, 12).toString("ascii");
        if (webpTag !== "WEBP") continue;
      }
      return true;
    }
  }
  return false;
}

function matchesAudioMagic(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) return "mp3";
  if (buffer.length >= 2 && buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0) return "mp3";
  if (buffer.length >= 4 && buffer[0] === 0x66 && buffer[1] === 0x4C && buffer[2] === 0x61 && buffer[3] === 0x63) return "flac";
  if (buffer.length >= 4 && buffer[0] === 0x4F && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) return "ogg";
  if (buffer.length >= 12 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) return "m4a";
  if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x41 && buffer[10] === 0x56 && buffer[11] === 0x45) return "wav";
  return null;
}

function detectImageExt(buffer: Buffer): string {
  if (buffer[0] === 0x89) return "png";
  if (buffer[0] === 0x47) return "gif";
  if (buffer[0] === 0x52) return "webp";
  return "jpg";
}

const AUDIO_CONTENT_TYPES: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  flac: "audio/flac",
};

const IMAGE_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

/** Save to local disk (development) */
async function saveLocal(filename: string, buffer: Buffer): Promise<string> {
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

/** Save to Cloudflare R2 (production) */
async function saveR2(filename: string, buffer: Buffer, contentType: string): Promise<string> {
  const pathname = `uploads/${filename}`;
  return uploadToR2(pathname, buffer, contentType);
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";
    const useR2 = isR2Enabled();

    if (!file) {
      return ApiResponse.badRequest("No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === "audio") {
      if (buffer.length > MAX_AUDIO_SIZE) {
        return ApiResponse.badRequest("音频文件大小不能超过 30MB");
      }

      const audioFormat = matchesAudioMagic(buffer);
      if (!audioFormat) {
        return ApiResponse.badRequest("不支持的音频格式，请上传 MP3、WAV、OGG、M4A 或 FLAC 文件");
      }

      const timestamp = Date.now();
      const random = randomBytes(8).toString("hex");
      const filename = `${timestamp}-${random}.${audioFormat}`;

      const url = useR2
        ? await saveR2(filename, buffer, AUDIO_CONTENT_TYPES[audioFormat] || "audio/mpeg")
        : await saveLocal(filename, buffer);

      return ApiResponse.ok({ url });
    }

    // Image upload (default)
    if (buffer.length > MAX_IMAGE_SIZE) {
      return ApiResponse.badRequest("图片大小不能超过 5MB");
    }

    if (!file.type.startsWith("image/")) {
      return ApiResponse.badRequest("仅允许上传图片文件");
    }

    if (!matchesImageMagic(buffer)) {
      return ApiResponse.badRequest("无效的图片格式");
    }

    const ext = detectImageExt(buffer);
    const timestamp = Date.now();
    const random = randomBytes(8).toString("hex");
    const filename = `${timestamp}-${random}.${ext}`;

    const url = useR2
      ? await saveR2(filename, buffer, IMAGE_CONTENT_TYPES[ext] || "image/jpeg")
      : await saveLocal(filename, buffer);

    return ApiResponse.ok({ url });
  } catch (err) {
    console.error("[upload] Upload failed:", err);
    return ApiResponse.serverError("Upload failed");
  }
}
