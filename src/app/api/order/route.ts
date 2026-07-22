import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations/order";
import { sendOrderEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { findVoucher } from "@/lib/vouchers";
import { formatPrice } from "@/lib/format";

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

  // Đơn mua có mã giảm giá: KIỂM TRA LẠI trên server (mã tồn tại + đơn đủ mức
  // tối thiểu + CÒN LƯỢT) rồi tự tính lại tổng — không tin số tiền client gửi.
  // Lưu code hợp lệ vào cột `order.voucher` để đếm số lượt đã dùng.
  let usedVoucher: string | null = null;
  if (d.type === "purchase") {
    const itemsTotal = d.items.reduce((s, i) => s + i.price * i.qty, 0);
    const v = d.voucher ? findVoucher(d.voucher) : undefined;

    if (v && itemsTotal >= v.minSubtotal) {
      // Đếm số đơn đã dùng mã này; hết lượt -> từ chối để không sai tổng tiền.
      const used = await prisma.order
        .count({ where: { voucher: v.code } })
        .catch(() => 0);
      if (used >= v.quantity) {
        return NextResponse.json(
          { ok: false, error: "voucher_used_up" },
          { status: 409 },
        );
      }
      usedVoucher = v.code;
      d.total = itemsTotal - v.amount;
      const line = `Mã giảm giá ${v.code}: -${formatPrice(v.amount)}`;
      d.note = d.note ? `${d.note}\n${line}` : line;
    } else {
      d.total = itemsTotal;
    }
  }

  // Đơn mua: bổ sung ảnh thật của sản phẩm (lấy từ DB theo slug) để đính vào
  // email cho đẹp. Client chỉ gửi slug — ảnh lấy từ DB là nguồn tin cậy.
  if (d.type === "purchase") {
    const slugs = Array.from(
      new Set(d.items.map((i) => i.slug).filter((s): s is string => Boolean(s))),
    );
    if (slugs.length) {
      try {
        const products = await prisma.product.findMany({
          where: { slug: { in: slugs } },
          select: { slug: true, images: true },
        });
        const imageBySlug = new Map(products.map((p) => [p.slug, p.images[0]]));
        d.items = d.items.map((i) => ({
          ...i,
          image: i.slug ? imageBySlug.get(i.slug) : undefined,
        }));
      } catch (err) {
        console.error("Lấy ảnh sản phẩm cho email lỗi:", err);
      }
    }
  }

  // Gắn đơn với tài khoản nếu khách đang đăng nhập (để hiện ở "Đơn hàng của tôi").
  const user = await getCurrentUser().catch(() => null);

  // Email khách để gửi thư xác nhận: đơn thu cũ lấy từ form; đơn mua lấy ô email
  // (nếu điền) hoặc email tài khoản đang đăng nhập.
  const customerEmail =
    d.type === "tradein"
      ? d.email
      : (d.email && d.email.trim()) || user?.email || null;

  // Lưu đơn vào database (để hiện trong admin).
  let saved = false;
  try {
    await prisma.order.create({
      data: {
        type: d.type,
        name: d.name,
        phone: d.phone,
        email: customerEmail,
        address: d.address,
        note: d.note ?? null,
        items: d.type === "purchase" ? d.items : undefined,
        total: d.type === "purchase" ? d.total : null,
        model: d.type === "tradein" ? d.model : null,
        upgradeTo: d.type === "tradein" ? (d.upgradeTo ?? null) : null,
        voucher: usedVoucher,
        userId: user?.id ?? null,
      },
    });
    saved = true;
  } catch (err) {
    console.error("Lưu đơn hàng lỗi:", err);
  }

  // Gửi email CHẠY NỀN: khách không phải chờ SMTP Gmail (vài giây) mới thấy
  // màn hình "Đặt hàng thành công". App chạy Node thường trên VPS (PM2) nên
  // promise vẫn chạy tiếp sau khi response đã trả về.
  void sendOrderEmail(d, customerEmail).catch((err) => {
    console.error("Gửi email đơn hàng lỗi:", err);
  });

  return NextResponse.json({ ok: true, saved });
}
