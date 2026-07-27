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

/**
 * Lấy gọn dung lượng để hiện chip: "16GB DDR5 5600MHz" -> "16GB",
 * "1TB PCIe® NVMe M.2 SSD gen 4" -> "1TB". Không khớp -> giữ nguyên chuỗi.
 */
export function shortSize(s: string): string {
  const m = (s ?? "").match(/\d+(\.\d+)?\s*(TB|GB)/i);
  return m ? m[0].replace(/\s+/g, "") : (s ?? "");
}

/**
 * Rút gọn tên CPU cho thẻ sản phẩm: bỏ phần trong ngoặc (mô tả nhân/xung/cache).
 * "AMD Ryzen 9 7945HX (16 nhân 32 luồng...)" -> "AMD Ryzen 9 7945HX".
 */
export function shortCpu(s: string): string {
  return (s ?? "").split("(")[0].trim();
}
