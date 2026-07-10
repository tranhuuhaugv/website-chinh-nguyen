import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { adminUserSchema } from "@/lib/validations/auth";

// Chỉ admin đã đăng nhập mới được thao tác (kiểm cookie phiên).
async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = adminUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "email_exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "admin" },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
