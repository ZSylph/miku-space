import { put, del, list, head } from "@vercel/blob";

/** True when Vercel Blob is configured (production mode). */
export function isBlobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Upload a buffer to Vercel Blob, returns the public URL. */
export async function uploadToBlob(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const blob = await put(pathname, body, {
    access: "public",
    contentType,
  });
  return blob.url;
}

/** Delete a single blob by its full URL or pathname. */
export async function deleteFromBlob(urlOrPathname: string): Promise<void> {
  try {
    await del(urlOrPathname);
  } catch {
    // Blob may not exist — safe to ignore
  }
}

/** List all blobs under the uploads/ prefix. */
export async function listBlobUploads(): Promise<
  { url: string; pathname: string; uploadedAt: Date }[]
> {
  const result: { url: string; pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;

  do {
    const response = await list({ prefix: "uploads/", cursor, limit: 1000 });
    for (const blob of response.blobs) {
      result.push({
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
      });
    }
    cursor = response.cursor || undefined;
  } while (cursor);

  return result;
}

/** Check if a blob exists by URL. */
export async function blobExists(url: string): Promise<boolean> {
  try {
    await head(url);
    return true;
  } catch {
    return false;
  }
}
