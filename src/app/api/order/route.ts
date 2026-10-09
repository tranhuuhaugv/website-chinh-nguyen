import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations/order";
import { sendOrderEmail, type OrderRef } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// Chống lạm dụng: endpoint công khai này gửi email tới địa chỉ khách nhập, nên giới hạn
// số đơn / IP trong 10 phút (bộ nhớ tiến trình — app chạy 1 tiến trình PM2 là đủ).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // dọn bớt để Map không phình mãi
    hits.forEach((v, k) => {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    });
  }
  return recent.length > MAX_PER_WINDOW;
}

// Nhận đơn (thu cũ / mua hàng) -> lưu vào DB + gửi email thông báo về Gmail.
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });
  }

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

  // Đơn mua: tính lại tổng trên server từ giá từng món — không tin số tiền client gửi.
  if (d.type === "purchase") {
    d.total = d.items.reduce((sum, i) => sum + i.price * i.qty, 0);
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
          // Ưu tiên ảnh trong DB (nguồn tin cậy); thiếu thì dùng ảnh client gửi kèm.
          image: (i.slug ? imageBySlug.get(i.slug) : undefined) ?? i.image,
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
  let ref: OrderRef | undefined;
  try {
    const created = await prisma.order.create({
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
        userId: user?.id ?? null,
      },
    });
    saved = true;
    // Mã đơn khách thấy = 6 ký tự cuối id (trùng mã trong trang admin).
    ref = { code: created.id.slice(-6).toUpperCase(), at: created.createdAt };
  } catch (err) {
    console.error("Lưu đơn hàng lỗi:", err);
  }

  // Gửi email CHẠY NỀN: khách không phải chờ SMTP Gmail (vài giây) mới thấy
  // màn hình "Đặt hàng thành công". App chạy Node thường trên VPS (PM2) nên
  // promise vẫn chạy tiếp sau khi response đã trả về.
  void sendOrderEmail(d, customerEmail, ref).catch((err) => {
    console.error("Gửi email đơn hàng lỗi:", err);
  });

  return NextResponse.json({ ok: true, saved, code: ref?.code ?? null });
}
