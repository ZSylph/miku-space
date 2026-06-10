import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-factory";
import { noteUpdateSchema } from "@/lib/validation";

export const GET = createGetHandler("note");

export const PUT = createUpdateHandler("note", noteUpdateSchema, {
  hasSlug: true,
  transformUpdate: (data) => {
    const result: Record<string, unknown> = { ...data };
    if ("tags" in data) {
      result.tags = JSON.stringify(data.tags);
    }
    return result;
  },
  fileFields: ["coverUrl"],
});

export const DELETE = createDeleteHandler("note", { fileFields: ["coverUrl"] });
