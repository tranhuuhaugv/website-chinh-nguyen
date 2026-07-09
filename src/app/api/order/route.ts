import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations/order";
import { sendOrderEmail } from "@/lib/mail";

// Nhận đơn (thu cũ / mua hàng) -> gửi email thông báo về Gmail.
// TODO: lưu đơn vào database khi có backend để hiển thị trong admin.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let emailed = false;
  try {
    emailed = await sendOrderEmail(parsed.data);
  } catch (err) {
    console.error("Gửi email đơn hàng lỗi:", err);
  }

  return NextResponse.json({ ok: true, emailed });
}
