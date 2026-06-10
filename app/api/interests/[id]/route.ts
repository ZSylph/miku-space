import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-factory";
import { interestUpdateSchema } from "@/lib/validation";

export const GET = createGetHandler("interest");

export const PUT = createUpdateHandler("interest", interestUpdateSchema, {
  fileFields: ["imageUrl"],
});

export const DELETE = createDeleteHandler("interest", { fileFields: ["imageUrl"] });
