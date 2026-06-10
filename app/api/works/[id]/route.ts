import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-factory";
import { workUpdateSchema } from "@/lib/validation";

export const GET = createGetHandler("work");

export const PUT = createUpdateHandler("work", workUpdateSchema, {
  hasSlug: true,
  transformUpdate: (data) => {
    const result: Record<string, unknown> = { ...data };
    if ("techStack" in data) {
      result.techStack = JSON.stringify(data.techStack);
    }
    return result;
  },
  fileFields: ["coverUrl"],
});

export const DELETE = createDeleteHandler("work", { fileFields: ["coverUrl"] });
