import { z } from "zod";

const phone = z
  .string()
  .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)");

// Đơn thu cũ đổi mới
export const tradeInSchema = z.object({
  type: z.literal("tradein"),
  name: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone,
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ"),
  model: z.string().min(2, "Vui lòng nhập tên mẫu máy cần thu"),
  upgradeTo: z.string().optional(),
  note: z.string().optional(),
});

// Đơn mua hàng
export const purchaseSchema = z.object({
  type: z.literal("purchase"),
  name: z.string().min(2, "Vui lòng nhập họ và tên"),
  phone,
  address: z.string().min(5, "Vui lòng nhập địa chỉ"),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        qty: z.number(),
      }),
    )
    .min(1),
  total: z.number(),
});

export const orderSchema = z.discriminatedUnion("type", [
  tradeInSchema,
  purchaseSchema,
]);

export type TradeInInput = z.infer<typeof tradeInSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
