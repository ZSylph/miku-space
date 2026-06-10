import { describe, it, expect } from "vitest";
import { ApiResponse } from "../api-utils";

describe("ApiResponse", () => {
  it("ok returns 200 with data", async () => {
    const res = ApiResponse.ok({ foo: "bar" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ foo: "bar" });
  });

  it("created returns 201 with data", () => {
    const res = ApiResponse.created({ id: 1 });
    expect(res.status).toBe(201);
  });

  it("badRequest returns 400 with error message", async () => {
    const res = ApiResponse.badRequest("Invalid input");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid input" });
  });

  it("unauthorized returns 401 with default message", async () => {
    const res = ApiResponse.unauthorized();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("notFound returns 404 with default message", async () => {
    const res = ApiResponse.notFound();
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("conflict returns 409 with message", async () => {
    const res = ApiResponse.conflict("Duplicate");
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Duplicate" });
  });

  it("serverError returns 500 with default message", async () => {
    const res = ApiResponse.serverError();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal error" });
  });
});
