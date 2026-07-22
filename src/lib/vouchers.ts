// Danh sách mã giảm giá dùng chung cho trang chủ (khối voucher), giỏ hàng
// (ô nhập mã) và server (/api/order kiểm tra lại — không tin dữ liệu client).
// Bật/tắt hiển thị khối trang chủ bằng Setting "vouchersEnabled" (/admin/cai-dat).

export interface Voucher {
  code: string;
  /** Số tiền giảm (VND). */
  amount: number;
  /** Giá trị đơn tối thiểu để áp mã (VND). */
  minSubtotal: number;
}

export const VOUCHERS: Voucher[] = [
  { code: "CN100K", amount: 100_000, minSubtotal: 5_000_000 },
  { code: "CN200K", amount: 200_000, minSubtotal: 10_000_000 },
  { code: "CN500K", amount: 500_000, minSubtotal: 20_000_000 },
];

export function normalizeVoucherCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function findVoucher(code: string): Voucher | undefined {
  const c = normalizeVoucherCode(code);
  return VOUCHERS.find((v) => v.code === c);
}
