import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, verifyCredentials } from "../auth";

describe("hashPassword", () => {
  it("returns a string with salt and hash separated by a dot", () => {
    const result = hashPassword("password123");
    expect(result).toContain(".");
    const [salt, hash] = result.split(".");
    expect(salt).toHaveLength(32); // 16 bytes hex
    expect(hash).toHaveLength(128); // 64 bytes hex
  });

  it("returns different hashes for the same password (different salts)", () => {
    const hash1 = hashPassword("password123");
    const hash2 = hashPassword("password123");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", () => {
    const hash = hashPassword("secret");
    expect(verifyPassword("secret", hash)).toBe(true);
  });

  it("returns false for incorrect password", () => {
    const hash = hashPassword("secret");
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("returns false for malformed hash", () => {
    expect(verifyPassword("secret", "invalid")).toBe(false);
    expect(verifyPassword("secret", "")).toBe(false);
  });
});

describe("verifyCredentials", () => {
  it("returns false when env vars are not set", () => {
    expect(verifyCredentials("admin", "admin")).toBe(false);
  });
});
