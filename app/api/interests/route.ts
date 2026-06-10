import { createListHandler, createCreateHandler } from "@/lib/api-factory";
import { interestCreateSchema } from "@/lib/validation";

export const GET = createListHandler("interest");
export const POST = createCreateHandler("interest", interestCreateSchema, {
  transformCreate: (data) => ({
    ...data,
    imageUrl: data.imageUrl ?? null,
    active: data.active ?? true,
  }),
});
