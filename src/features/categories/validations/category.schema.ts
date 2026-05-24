import { z } from "zod";

export const CategoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Tên chuyên mục không được để trống")
    .max(100, "Tên quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  description: z.string().max(500).optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
