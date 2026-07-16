import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getBaseUrl } from "@/lib/base-url";
import { RESET_EXPIRES_MINUTES, hashResetToken } from "@/lib/password-reset";

// Quên mật khẩu: tạo token, gửi link đặt lại về email khách. Cần Node runtime.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  // LUÔN trả về ok dù email có tồn tại hay không: trả lời khác nhau sẽ để lộ
  // email nào có tài khoản trên web (dò tài khoản).
  const ok = NextResponse.json({ ok: true });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return ok;

    // Xoá token cũ của user -> mỗi lúc chỉ 1 link còn hiệu lực.
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const raw = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashResetToken(raw),
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_EXPIRES_MINUTES * 60 * 1000),
      },
    });

    // Gửi mail CHẠY NỀN: nếu chờ SMTP (vài giây) mới trả lời thì email CÓ tài
    // khoản sẽ chậm hơn hẳn email không có -> tự nó lộ ra email nào tồn tại.
    const link = `${getBaseUrl(req)}/dat-lai-mat-khau?token=${raw}`;
    void sendPasswordResetEmail(user.email, link, RESET_EXPIRES_MINUTES).catch(
      (err) => console.error("Gửi mail đặt lại mật khẩu lỗi:", err),
    );
  } catch (err) {
    // Lỗi cũng không lộ ra ngoài (giữ nguyên câu trả lời chung).
    console.error("Gửi link đặt lại mật khẩu lỗi:", err);
  }

  return ok;
}
