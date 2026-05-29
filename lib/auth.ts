import "dotenv/config";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}.${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(".");
  if (!salt || !key) return false;

  const derivedKey = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");

  if (derivedKey.length !== keyBuffer.length) return false;
  return timingSafeEqual(derivedKey, keyBuffer);
}

export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return false;
  }

  if (username !== adminUsername) {
    return false;
  }

  return verifyPassword(password, adminPasswordHash);
}
