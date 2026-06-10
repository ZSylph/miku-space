import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-factory";
import { songUpdateSchema } from "@/lib/validation";

export const GET = createGetHandler("song");

export const PUT = createUpdateHandler("song", songUpdateSchema, {
  transformUpdate: (data) => {
    const result: Record<string, unknown> = { ...data };
    if ("lyrics" in data) {
      result.lyrics = data.lyrics ? JSON.stringify(data.lyrics) : null;
    }
    return result;
  },
  fileFields: ["audioUrl", "coverUrl"],
});

export const DELETE = createDeleteHandler("song", { fileFields: ["audioUrl", "coverUrl"] });
