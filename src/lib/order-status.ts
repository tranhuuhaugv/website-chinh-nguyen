// Trạng thái đơn hàng (cột Order.status) dùng chung cho trang tổng quan + trang Đơn hàng.

export const ORDER_STATUSES = ["new", "processing", "done", "canceled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Mới",
  processing: "Đang xử lý",
  done: "Hoàn thành",
  canceled: "Đã huỷ",
};

export const ORDER_STATUS_CLS: Record<OrderStatus, string> = {
  new: "bg-[#FFF1D9] text-[#B45309]",
  processing: "bg-[#E4F0FB] text-[#1D6FE0]",
  done: "bg-green-soft text-green-d",
  canceled: "bg-[#F1F3F1] text-muted",
};

export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (ORDER_STATUSES as readonly string[]).includes(v);
}
