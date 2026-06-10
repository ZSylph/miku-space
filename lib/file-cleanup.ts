import { unlink, readdir, stat } from "fs/promises";
import { join } from "path";
import { getPrisma } from "@/lib/prisma";
import { getCloudflareEnv } from "@/lib/prisma";
import { isR2Enabled, listR2Uploads, deleteFromR2 } from "@/lib/r2";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

/* ──────────────────────────────────────────────
 *  Helpers
 * ────────────────────────────────────────────── */

/** Check if a URL is a Cloudflare R2 URL. */
function isR2Url(url: string): boolean {
  return url.includes(".r2.cloudflarestorage.com/");
}

/** Check if a URL is a managed upload (local /uploads/ or Cloudflare R2). */
function isManagedUrl(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  if (isR2Url(url)) return true;
  return false;
}

/* ──────────────────────────────────────────────
 *  Delete single file
 * ────────────────────────────────────────────── */

export async function deleteUploadFile(
  url: string | null | undefined
): Promise<void> {
  if (!url || !isManagedUrl(url)) return;

  if (isR2Enabled() && isR2Url(url)) {
    const env = getCloudflareEnv()!;
    const publicUrl = (env.R2_PUBLIC_URL as string) || "";
    const key = url.replace(publicUrl.replace(/\/$/, "") + "/", "");
    await deleteFromR2(key);
    return;
  }

  // Local mode
  if (!url.startsWith("/uploads/")) return;
  const filename = url.slice("/uploads/".length);
  if (filename.includes("/") || filename.includes("\\")) return;

  const filepath = join(UPLOADS_DIR, filename);
  try {
    await unlink(filepath);
  } catch {
    // File may not exist — safe to ignore
  }
}

/* ──────────────────────────────────────────────
 *  Collect all URLs referenced in the database
 * ────────────────────────────────────────────── */

export async function collectAllUsedUrls(): Promise<Set<string>> {
  const prisma = getPrisma();
  const used = new Set<string>();

  const [songs, posts, notes, works, interests] = await Promise.all([
    prisma.song.findMany({ select: { audioUrl: true, coverUrl: true } }),
    prisma.post.findMany({ select: { coverUrl: true } }),
    prisma.note.findMany({ select: { coverUrl: true } }),
    prisma.work.findMany({ select: { coverUrl: true } }),
    prisma.interest.findMany({ select: { imageUrl: true } }),
  ]);

  const addIfManaged = (url: string | null | undefined) => {
    if (url && isManagedUrl(url)) used.add(url);
  };

  for (const s of songs) { addIfManaged(s.audioUrl); addIfManaged(s.coverUrl); }
  for (const p of posts) { addIfManaged(p.coverUrl); }
  for (const n of notes) { addIfManaged(n.coverUrl); }
  for (const w of works) { addIfManaged(w.coverUrl); }
  for (const i of interests) { addIfManaged(i.imageUrl); }

  return used;
}

/* ──────────────────────────────────────────────
 *  Cleanup orphan uploads
 * ────────────────────────────────────────────── */

export async function cleanupOrphanUploads(
  gracePeriodMs = 60 * 60 * 1000
): Promise<{ deleted: string[] }> {
  const used = await collectAllUsedUrls();
  const deleted: string[] = [];

  if (isR2Enabled()) {
    const objects = await listR2Uploads();

    for (const obj of objects) {
      if (used.has(obj.url)) continue;

      // Grace period
      if (obj.lastModified && Date.now() - obj.lastModified.getTime() < gracePeriodMs) continue;

      await deleteFromR2(obj.key);
      deleted.push(obj.key);
    }
    return { deleted };
  }

  // Local mode
  let files: string[];
  try {
    files = await readdir(UPLOADS_DIR);
  } catch {
    return { deleted };
  }

  const now = Date.now();

  for (const filename of files) {
    const url = `/uploads/${filename}`;
    if (used.has(url)) continue;

    const filepath = join(UPLOADS_DIR, filename);
    try {
      const fileStat = await stat(filepath);
      if (now - fileStat.mtimeMs < gracePeriodMs) continue;
      await unlink(filepath);
      deleted.push(filename);
    } catch {
      // skip
    }
  }

  return { deleted };
}

/* ──────────────────────────────────────────────
 *  Cleanup replaced file
 * ────────────────────────────────────────────── */

export async function cleanupReplacedFile(
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined
): Promise<void> {
  if (!oldUrl || !isManagedUrl(oldUrl)) return;
  if (oldUrl === newUrl) return;

  const used = await collectAllUsedUrls();
  if (!used.has(oldUrl)) {
    await deleteUploadFile(oldUrl);
  }
}
