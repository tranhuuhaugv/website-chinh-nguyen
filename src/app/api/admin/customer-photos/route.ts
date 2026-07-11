import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Lưu danh sách URL ảnh khách hàng (trang chủ) vào Setting "customerPhotos".
// Chỉ admin đã đăng nhập.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    images?: unknown;
  } | null;
  const images = Array.isArray(body?.images)
    ? body!.images.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : [];

  const value = JSON.stringify(images);
  await prisma.setting.upsert({
    where: { key: "customerPhotos" },
    update: { value },
    create: { key: "customerPhotos", value },
  });

  return NextResponse.json({ ok: true, count: images.length });
}
