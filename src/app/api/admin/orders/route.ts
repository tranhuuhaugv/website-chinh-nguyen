import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Xoá đơn hàng trong khu admin (đơn spam / rác). Chỉ admin đã đăng nhập.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Xoá đơn hàng lỗi:", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
