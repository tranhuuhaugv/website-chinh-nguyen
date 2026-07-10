import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerApiSchema } from "@/lib/validations/auth";
import { sendRegisterEmail } from "@/lib/mail";

// Đăng ký tài khoản: lưu vào DB (mật khẩu mã hoá) + gửi email báo về Gmail.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = registerApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { name, email, phone, password } = parsed.data;

  // Email đã tồn tại?
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "email_exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, phone, passwordHash, role: "user" },
  });

  try {
    await sendRegisterEmail({ name, email, phone });
  } catch (err) {
    console.error("Gửi email đăng ký lỗi:", err);
  }

  return NextResponse.json({ ok: true });
}
