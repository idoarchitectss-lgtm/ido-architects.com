import { z } from "zod";
import { PostType } from "@/features/posts/validations/post.schema";

export const CategoryCreateSchema = z.object({
  type: z.nativeEnum(PostType, { required_error: "Vui lòng chọn loại bài viết" }),
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
  image: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
