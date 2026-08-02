import { NextResponse } from "next/server";
import { getVoucherUsage, getVouchers } from "@/lib/data";

// Danh sách mã giảm giá công khai + số lượt còn lại — giỏ hàng gọi để nhập/kiểm
// tra mã. force-dynamic: luôn tính theo số đơn thật + cài đặt mới nhất.
export const dynamic = "force-dynamic";

export async function GET() {
  const [list, usage] = await Promise.all([
    getVouchers(),
    getVoucherUsage().catch((): Record<string, number> => ({})),
  ]);
  const remaining: Record<string, number> = {};
  for (const v of list) {
    remaining[v.code] = Math.max(0, v.quantity - (usage[v.code] ?? 0));
  }
  // Chỉ trả trường công khai (không lộ quantity gốc).
  const vouchers = list.map((v) => ({
    code: v.code,
    amount: v.amount,
    minSubtotal: v.minSubtotal,
  }));
  return NextResponse.json({ vouchers, remaining });
}
