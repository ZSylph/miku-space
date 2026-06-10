import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getCloudflareEnv } from "@/lib/prisma";

/* ──────────────────────────────────────────────
 *  S3 Client (lazy, production only)
 * ────────────────────────────────────────────── */

function getR2Client(): S3Client | null {
  const env = getCloudflareEnv();
  const endpoint = env?.R2_ENDPOINT as string | undefined;
  const accessKeyId = env?.R2_ACCESS_KEY_ID as string | undefined;
  const secretAccessKey = env?.R2_SECRET_ACCESS_KEY as string | undefined;

  if (!endpoint || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

/** True when R2 credentials are configured (production mode). */
export function isR2Enabled(): boolean {
  return getR2Client() !== null;
}

/* ──────────────────────────────────────────────
 *  CRUD operations
 * ────────────────────────────────────────────── */

/** Upload a buffer to R2, returns the public URL. */
export async function uploadToR2(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const client = getR2Client()!;
  const env = getCloudflareEnv()!;
  const bucket = (env.R2_BUCKET_NAME as string) || "uploads";
  const publicUrl = (env.R2_PUBLIC_URL as string) || "";

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: pathname,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `${publicUrl.replace(/\/$/, "")}/${pathname}`;
}

/** Delete a single object from R2. */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  if (!client) return;

  const env = getCloudflareEnv()!;
  const bucket = (env.R2_BUCKET_NAME as string) || "uploads";

  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key }),
    );
  } catch {
    // Object may not exist — safe to ignore
  }
}

/** List all objects under the uploads/ prefix. */
export async function listR2Uploads(): Promise<
  { key: string; url: string; lastModified?: Date }[]
> {
  const client = getR2Client()!;
  const env = getCloudflareEnv()!;
  const bucket = (env.R2_BUCKET_NAME as string) || "uploads";
  const publicUrl = (env.R2_PUBLIC_URL as string) || "";

  const result: { key: string; url: string; lastModified?: Date }[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: "uploads/",
        ContinuationToken: continuationToken,
      }),
    );

    for (const obj of response.Contents ?? []) {
      if (!obj.Key) continue;
      result.push({
        key: obj.Key,
        url: `${publicUrl.replace(/\/$/, "")}/${obj.Key}`,
        lastModified: obj.LastModified,
      });
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return result;
}

/** Check if an R2 object exists. */
export async function r2ObjectExists(key: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) return false;

  const env = getCloudflareEnv()!;
  const bucket = (env.R2_BUCKET_NAME as string) || "uploads";

  try {
    await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}
