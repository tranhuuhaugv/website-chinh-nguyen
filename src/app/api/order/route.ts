import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations/order";
import { sendOrderEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

// Nhận đơn (thu cũ / mua hàng) -> lưu vào DB + gửi email thông báo về Gmail.
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

  const d = parsed.data;

  // Lưu đơn vào database (để hiện trong admin).
  try {
    await prisma.order.create({
      data: {
        type: d.type,
        name: d.name,
        phone: d.phone,
        email: d.type === "tradein" ? d.email : null,
        address: d.address,
        note: d.note ?? null,
        items: d.type === "purchase" ? d.items : undefined,
        total: d.type === "purchase" ? d.total : null,
        model: d.type === "tradein" ? d.model : null,
        upgradeTo: d.type === "tradein" ? (d.upgradeTo ?? null) : null,
      },
    });
  } catch (err) {
    console.error("Lưu đơn hàng lỗi:", err);
  }

  // Gửi email thông báo.
  let emailed = false;
  try {
    emailed = await sendOrderEmail(d);
  } catch (err) {
    console.error("Gửi email đơn hàng lỗi:", err);
  }

  return NextResponse.json({ ok: true, emailed });
}
