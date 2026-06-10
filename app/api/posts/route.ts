import { createListHandler, createCreateHandler } from "@/lib/api-factory";
import { postCreateSchema } from "@/lib/validation";

export const GET = createListHandler("post");
export const POST = createCreateHandler("post", postCreateSchema, {
  hasSlug: true,
  transformCreate: (data) => ({
    ...data,
    tags: JSON.stringify(data.tags ?? []),
    featured: data.featured ?? false,
    published: data.published ?? false,
  }),
});
