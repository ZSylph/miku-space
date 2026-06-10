import { createListHandler, createCreateHandler } from "@/lib/api-factory";
import { noteCreateSchema } from "@/lib/validation";

export const GET = createListHandler("note");
export const POST = createCreateHandler("note", noteCreateSchema, {
  hasSlug: true,
  transformCreate: (data) => ({
    ...data,
    tags: JSON.stringify(data.tags ?? []),
    published: data.published ?? false,
  }),
});
