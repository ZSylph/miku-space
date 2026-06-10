import { createListHandler, createCreateHandler } from "@/lib/api-factory";
import { songCreateSchema } from "@/lib/validation";

export const GET = createListHandler("song", { activeQueryParam: true });
export const POST = createCreateHandler("song", songCreateSchema, {
  transformCreate: (data) => ({
    ...data,
    lyrics: data.lyrics ? JSON.stringify(data.lyrics) : null,
  }),
});
