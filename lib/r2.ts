import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

let _client: S3Client | null = null;

/**
 * Returns the R2 S3 client if all required env vars are set, or null.
 */
export function getR2Client(): S3Client | null {
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;

  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _client;
}

/** True when R2 env vars are configured (production mode). */
export function isR2Enabled(): boolean {
  return getR2Client() !== null;
}

export function getR2Bucket(): string {
  return process.env.R2_BUCKET_NAME || "uploads";
}

export function getR2PublicUrl(): string {
  return (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
}

/** Upload a buffer to R2, returns the public URL. */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const client = getR2Client()!;
  await client.send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return `${getR2PublicUrl()}/${key}`;
}

/** Delete a single object from R2. */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  if (!client) return;
  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: getR2Bucket(), Key: key }),
    );
  } catch {
    // Object may not exist — safe to ignore
  }
}

/** List all object keys in the uploads/ prefix. */
export async function listR2Uploads(): Promise<{ key: string; lastModified?: Date }[]> {
  const client = getR2Client();
  if (!client) return [];

  const results: { key: string; lastModified?: Date }[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: getR2Bucket(),
        Prefix: "uploads/",
        ContinuationToken: continuationToken,
      }),
    );
    for (const obj of res.Contents || []) {
      if (obj.Key) results.push({ key: obj.Key, lastModified: obj.LastModified });
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return results;
}

/** Check if an object exists in R2. */
export async function r2Exists(key: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) return false;
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: getR2Bucket(), Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}
