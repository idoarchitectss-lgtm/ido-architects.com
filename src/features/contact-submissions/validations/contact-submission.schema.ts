import { z } from "zod";

// ─── Public submit (from contact form) ───────────────────────────────────────
export const ContactSubmitSchema = z.object({
  name: z.string().min(2, "Điền ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không đúng định dạng"),
  phone: z
    .string()
    .regex(
      /^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[0-689]|9[0-9])\d{7}$/,
      "Số điện thoại không hợp lệ (VD: 0901234567)"
    ),
  message: z.string().max(2000).optional(),
  serviceId: z.string().optional().nullable(),
});

// ─── Admin query ─────────────────────────────────────────────────────────────
export const ContactQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  status: z
    .enum(["NEW", "READ", "RESOLVED", "SPAM"])
    .optional(),
});

// ─── Admin update (status + optional note) ───────────────────────────────────
export const ContactUpdateSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED", "SPAM"]),
  note: z.string().max(1000).optional(),
});

export type ContactSubmitInput = z.infer<typeof ContactSubmitSchema>;
export type ContactQuery = z.infer<typeof ContactQuerySchema>;
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>;
