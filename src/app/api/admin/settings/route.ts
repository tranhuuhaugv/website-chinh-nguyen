import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Lưu cài đặt hiển thị (vd flashSaleEnabled) vào bảng Setting. Chỉ admin.
async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

const ALLOWED = new Set([
  // Bật trang "Website đang hoàn thiện" thay cho trang chủ.
  "comingSoon",
  "flashSaleEnabled",
  // Lịch Flash Sale (giờ VN, dạng "YYYY-MM-DDTHH:mm"). Trống = không giới hạn.
  "flashSaleStart",
  "flashSaleEnd",
  "vouchersEnabled",
  // Link 3 nút liên hệ nổi (gọi / Messenger / Zalo)
  "floatPhone",
  "floatMessenger",
  "floatZalo",
  // Danh sách nhu cầu sử dụng (JSON) — admin tự sửa
  "needs",
  // Danh sách mã giảm giá (JSON) — admin tự sửa
  "vouchers",
  // Danh sách cửa hàng (JSON [{name,address,city}]) — admin tự sửa
  "stores",
  // Badge chứng nhận ở footer: bật/tắt + link (BCT online.gov.vn / DMCA)
  "bctEnabled",
  "bctUrl",
  "dmcaEnabled",
  "dmcaUrl",
  // Dòng bản quyền cuối footer (bật khi BCT duyệt xong)
  "copyrightEnabled",
]);

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    key?: unknown;
    value?: unknown;
  } | null;
  const key = String(body?.key ?? "");
  if (!ALLOWED.has(key)) {
    return NextResponse.json({ ok: false, error: "bad_key" }, { status: 400 });
  }
  const value = String(body?.value ?? "");

  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  // Nút liên hệ nổi có trên MỌI trang -> làm mới toàn bộ (revalidate layout);
  // các cờ hiển thị khác cũng được làm mới ngay.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
