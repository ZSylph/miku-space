import { NextResponse } from "next/server";

export const ApiResponse = {
  ok: (data: unknown) => NextResponse.json(data),
  created: (data: unknown) => NextResponse.json(data, { status: 201 }),
  badRequest: (message: string) =>
    NextResponse.json({ error: message }, { status: 400 }),
  unauthorized: (message: string = "Unauthorized") =>
    NextResponse.json({ error: message }, { status: 401 }),
  notFound: (message: string = "Not found") =>
    NextResponse.json({ error: message }, { status: 404 }),
  conflict: (message: string) =>
    NextResponse.json({ error: message }, { status: 409 }),
  serverError: (message: string = "Internal error") =>
    NextResponse.json({ error: message }, { status: 500 }),
};
