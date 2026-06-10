import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-factory";
import { postUpdateSchema } from "@/lib/validation";

export const GET = createGetHandler("post");

export const PUT = createUpdateHandler("post", postUpdateSchema, {
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

export const DELETE = createDeleteHandler("post", { fileFields: ["coverUrl"] });
