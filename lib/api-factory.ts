import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-auth";
import { ApiResponse } from "@/lib/api-utils";
import { cleanupReplacedFile, deleteUploadFile } from "@/lib/file-cleanup";

/* ──────────────────────────────────────────────
 *  Prisma dynamic model access helper
 * ────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(modelName: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[modelName];
}

interface CrudHandlersOptions {
  /** Whether this model has a slug field that must be unique */
  hasSlug?: boolean;
  /** Transform validated data before create (e.g. JSON stringify arrays) */
  transformCreate?: (data: Record<string, unknown>) => Record<string, unknown>;
  /** Transform validated data before update */
  transformUpdate?: (data: Record<string, unknown>) => Record<string, unknown>;
  /** Fields that may contain uploaded file URLs — cleaned up on update/delete */
  fileFields?: string[];
}

/* ──────────────────────────────────────────────
 *  List (GET /api/:model)
 * ────────────────────────────────────────────── */

export function createListHandler(
  modelName: string,
  options?: { activeQueryParam?: boolean },
) {
  return async (request?: Request) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    const model = getModel(modelName);
    let where: Record<string, unknown> | undefined;

    if (options?.activeQueryParam && request) {
      const url = new URL(request.url);
      if (url.searchParams.get("active") === "true") {
        where = { active: true };
      }
    }

    const items = await model.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return ApiResponse.ok(items);
  };
}

/* ──────────────────────────────────────────────
 *  Create (POST /api/:model)
 * ────────────────────────────────────────────── */

export function createCreateHandler(
  modelName: string,
  schema: z.ZodSchema,
  options?: CrudHandlersOptions,
) {
  return async (request: Request) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
      const body = await request.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        const message = parsed.error.issues.map((i) => i.message).join(", ");
        return ApiResponse.badRequest(message);
      }

      const data = parsed.data as Record<string, unknown>;

      if (options?.hasSlug && data.slug) {
        const existing = await getModel(modelName).findUnique({
          where: { slug: data.slug },
        });
        if (existing) {
          return ApiResponse.conflict("Slug 已存在");
        }
      }

      const maxOrder = await getModel(modelName).aggregate({
        _max: { order: true },
      });
      const nextOrder = (maxOrder._max.order ?? -1) + 1;

      const createData = options?.transformCreate
        ? options.transformCreate(data)
        : data;

      const item = await getModel(modelName).create({
        data: { ...createData, order: nextOrder },
      });

      return ApiResponse.created(item);
    } catch (err) {
      console.error(`[${modelName}:POST] Failed:`, err);
      return ApiResponse.serverError("创建失败");
    }
  };
}

/* ──────────────────────────────────────────────
 *  Get by ID (GET /api/:model/:id)
 * ────────────────────────────────────────────── */

export function createGetHandler(modelName: string) {
  return async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    const { id } = await params;
    const item = await getModel(modelName).findUnique({ where: { id } });

    if (!item) {
      return ApiResponse.notFound();
    }

    return ApiResponse.ok(item);
  };
}

/* ──────────────────────────────────────────────
 *  Update (PUT /api/:model/:id)
 * ────────────────────────────────────────────── */

export function createUpdateHandler(
  modelName: string,
  schema: z.ZodSchema,
  options?: CrudHandlersOptions,
) {
  return async (
    request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
      const { id } = await params;
      const body = await request.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        const message = parsed.error.issues.map((i) => i.message).join(", ");
        return ApiResponse.badRequest(message);
      }

      const data = parsed.data as Record<string, unknown>;

      if (options?.hasSlug && data.slug) {
        const existing = await getModel(modelName).findFirst({
          where: { slug: data.slug, NOT: { id } },
        });
        if (existing) {
          return ApiResponse.conflict("Slug 已存在");
        }
      }

      const oldItem = await getModel(modelName).findUnique({ where: { id } });

      const updateData = options?.transformUpdate
        ? options.transformUpdate(data)
        : data;

      const item = await getModel(modelName).update({
        where: { id },
        data: updateData,
      });

      if (oldItem && options?.fileFields) {
        for (const field of options.fileFields) {
          if (field in data) {
            await cleanupReplacedFile(
              oldItem[field] as string | null,
              item[field] as string | null,
            );
          }
        }
      }

      return ApiResponse.ok(item);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code: string }).code === "P2025"
      ) {
        return ApiResponse.notFound("记录不存在");
      }
      console.error(`[${modelName}:PUT] Failed:`, err);
      return ApiResponse.serverError("更新失败");
    }
  };
}

/* ──────────────────────────────────────────────
 *  Delete (DELETE /api/:model/:id)
 * ────────────────────────────────────────────── */

export function createDeleteHandler(
  modelName: string,
  options?: Pick<CrudHandlersOptions, "fileFields">,
) {
  return async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
      const { id } = await params;
      const item = await getModel(modelName).findUnique({ where: { id } });
      if (!item) {
        return ApiResponse.notFound("记录不存在");
      }

      await getModel(modelName).delete({ where: { id } });

      if (options?.fileFields) {
        for (const field of options.fileFields) {
          await deleteUploadFile(item[field] as string | null);
        }
      }

      return ApiResponse.ok({ success: true });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code: string }).code === "P2025"
      ) {
        return ApiResponse.notFound("记录不存在");
      }
      console.error(`[${modelName}:DELETE] Failed:`, err);
      return ApiResponse.serverError("删除失败");
    }
  };
}

/* ──────────────────────────────────────────────
 *  Reorder (PUT /api/:model/reorder)
 * ────────────────────────────────────────────── */

export function createReorderHandler(modelName: string) {
  return async (request: Request) => {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
      const body = await request.json();
      const parsed = reorderSchema.safeParse(body);
      if (!parsed.success) {
        return ApiResponse.badRequest("Invalid reorder data");
      }

      await prisma.$transaction(
        parsed.data.orders.map((item: { id: string; order: number }) =>
          getModel(modelName).update({
            where: { id: item.id },
            data: { order: item.order },
          }),
        ),
      );

      return ApiResponse.ok({ success: true });
    } catch (err) {
      console.error(`[${modelName}/reorder] Failed:`, err);
      return ApiResponse.serverError("排序更新失败");
    }
  };
}

const reorderSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.string(),
        order: z.number().int(),
      }),
    )
    .min(1),
});
