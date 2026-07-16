import { z } from "zod";

// Schema validate form đăng nhập / đăng ký (dùng chung client & server).

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Vui lòng nhập họ và tên"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
    agree: z.boolean().refine((v) => v, {
      message: "Bạn cần đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

// Schema cho API đăng ký (chỉ các trường server cần lưu).
export const registerApiSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ và tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

// Quên mật khẩu: gửi link đặt lại về email.
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

// Đặt lại mật khẩu bằng token trong link email.
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Thiếu mã đặt lại mật khẩu"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

// Schema tạo tài khoản quản trị (trong admin).
export const adminUserSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterApiInput = z.infer<typeof registerApiSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
