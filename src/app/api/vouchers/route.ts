import { NextResponse } from "next/server";
import { getVoucherUsage } from "@/lib/data";
import { VOUCHERS } from "@/lib/vouchers";

// Số lượt còn lại của từng mã giảm giá (công khai) — giỏ hàng gọi để chặn mã đã hết.
// force-dynamic: luôn tính theo số đơn thật, không cache.
export const dynamic = "force-dynamic";

export async function GET() {
  const usage = await getVoucherUsage().catch(
    (): Record<string, number> => ({}),
  );
  const remaining: Record<string, number> = {};
  for (const v of VOUCHERS) {
    remaining[v.code] = Math.max(0, v.quantity - (usage[v.code] ?? 0));
  }
  return NextResponse.json({ remaining });
}
