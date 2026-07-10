import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  checkAdminCredentials,
  createAdminToken,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = body.email ?? "";
  const password = body.password ?? "";

  // 1) Admin gốc trong .env
  let ok = checkAdminCredentials(email, password);

  // 2) Admin lưu trong database (role = admin)
  if (!ok && email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.role === "admin") {
      ok = await bcrypt.compare(password, user.passwordHash);
    }
  }

  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
