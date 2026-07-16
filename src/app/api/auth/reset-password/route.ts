import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashResetToken } from "@/lib/password-reset";

// Đặt lại mật khẩu bằng token trong link email. Cần Node runtime (bcrypt).
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { token, password } = parsed.data;

  try {
    const row = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(token) },
    });
    // Sai / đã dùng / hết hạn -> cùng 1 thông báo, không nói rõ sai chỗ nào.
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "invalid_token" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        // Khách Google đặt mật khẩu -> từ giờ đăng nhập được cả 2 kiểu.
        data: { passwordHash },
      }),
      // Đánh dấu đã dùng + dọn mọi token khác của user.
      prisma.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: row.userId, usedAt: null },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Đặt lại mật khẩu lỗi:", err);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
