import { z } from "zod";

// ─── PostType enum (mirror Prisma — safe to use in Client Components) ─────────
export const PostType = {
  BLOG_POST: "BLOG_POST",
  PROJECT_POST: "PROJECT_POST",
} as const;
export type PostType = (typeof PostType)[keyof typeof PostType];

// ─── ProjectMeta schema ───────────────────────────────────────────────────────
export const ProjectMetaSchema = z.object({
  nameOfProject: z.string().optional(),
  addressOfProperty: z.string().optional(),
  completedYear: z.string().optional(),
  floorDimension: z.coerce.number().positive().optional(),
  numberOfFloors: z.coerce.number().int().positive().optional(),
  propertyType: z.string().optional(),
  designedCompany: z.string().optional(),
  isCompleted: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Base object (tách riêng để .partial() dùng được cho Update) ─────────────
const PostBaseObject = z.object({
  type: z.nativeEnum(PostType).default(PostType.BLOG_POST),
  title: z.string().min(3, "Tiêu đề ít nhất 3 ký tự").max(200),
  slug: z.string().min(3, "Slug ít nhất 3 ký tự").regex(slugRegex, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Nội dung không được để trống"),
  featuredImage: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  projectMeta: ProjectMetaSchema.optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// ─── Create schema ────────────────────────────────────────────────────────────
export const PostCreateSchema = PostBaseObject.refine(
  (data) => data.type !== PostType.PROJECT_POST || (!!data.featuredImage && data.featuredImage.length > 0),
  { message: "Bài viết dự án cần có ảnh đại diện", path: ["featuredImage"] }
);

// ─── Update schema (tất cả optional trừ title, slug, type) ───────────────────
export const PostUpdateSchema = PostBaseObject.partial()
  .required({ title: true, slug: true, type: true })
  .refine(
    (data) => data.type !== PostType.PROJECT_POST || !data.featuredImage || data.featuredImage.length > 0,
    { message: "Bài viết dự án cần có ảnh đại diện", path: ["featuredImage"] }
  );

// ─── Query params schema ──────────────────────────────────────────────────────
export const PostQuerySchema = z.object({
  type: z.nativeEnum(PostType).optional(),
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  showAll: z.string().transform((v) => v === "true").optional(),
  isFeatured: z.string().transform((v) => v === "true").optional(),
  isCompleted: z.string().transform((v) => v === "true").optional(),
  search: z.string().max(200).optional(),
});

// ─── Inferred types ───────────────────────────────────────────────────────────
export type PostInput = z.infer<typeof PostCreateSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
export type ProjectMetaInput = z.infer<typeof ProjectMetaSchema>;
