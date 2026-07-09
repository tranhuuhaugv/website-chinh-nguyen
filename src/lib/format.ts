// Định dạng tiền tệ nhất quán toàn app: VND, có phân cách hàng nghìn.

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** 28990000 -> "28.990.000 ₫" */
export function formatPrice(value: number): string {
  return vnd.format(value);
}
