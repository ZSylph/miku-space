import { createListHandler, createCreateHandler } from "@/lib/api-factory";
import { workCreateSchema } from "@/lib/validation";

export const GET = createListHandler("work");
export const POST = createCreateHandler("work", workCreateSchema, {
  hasSlug: true,
  transformCreate: (data) => ({
    ...data,
    techStack: JSON.stringify(data.techStack ?? []),
    featured: data.featured ?? false,
  }),
});
