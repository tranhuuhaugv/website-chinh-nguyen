import { z } from "zod";

// Chỉ thanh toán COD nên form chỉ cần thông tin giao hàng.
export const checkoutSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  // Email BẮT BUỘC — để gửi thư xác nhận đơn hàng cho khách.
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ nhận hàng"),
  note: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
