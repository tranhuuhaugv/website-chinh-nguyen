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

const ALLOWED = new Set(["flashSaleEnabled", "vouchersEnabled"]);

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

  // Trang chủ dùng ISR -> làm mới ngay để thay đổi hiển thị liền.
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
