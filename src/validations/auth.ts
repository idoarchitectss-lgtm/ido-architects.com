import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
