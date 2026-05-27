import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ServiceBaseObject = z.object({
  title: z.string().min(2, "Tiêu đề ít nhất 2 ký tự").max(200),
  slug: z
    .string()
    .min(2, "Slug ít nhất 2 ký tự")
    .regex(slugRegex, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  featuredImage: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
  icon: z.string().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
});

export const ServiceCreateSchema = ServiceBaseObject;
export const ServiceUpdateSchema = ServiceBaseObject.partial().required({ title: true, slug: true });

export const ServiceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  showAll: z
    .string()
    .transform((v) => v === "true")
    .optional(),
});

export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>;
export type ServiceQuery = z.infer<typeof ServiceQuerySchema>;
