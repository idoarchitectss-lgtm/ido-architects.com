import { z } from "zod";

export const MediaUpdateSchema = z.object({
  filename: z
    .string()
    .min(1, "Tên file không được để trống")
    .max(255, "Tên file tối đa 255 ký tự")
    .optional(),
  alt: z.string().max(255, "Alt text tối đa 255 ký tự").optional().nullable(),
});

export type MediaUpdateInput = z.infer<typeof MediaUpdateSchema>;
