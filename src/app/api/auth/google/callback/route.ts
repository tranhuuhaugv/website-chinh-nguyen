import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE, createUserToken } from "@/lib/session";
import {
  googleConfigured,
  exchangeCodeForToken,
  getGoogleUser,
} from "@/lib/google";

export const dynamic = "force-dynamic";

// Bước 2: Google gọi lại kèm code -> đổi lấy hồ sơ -> tạo/khớp user -> set phiên.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const fail = (code: string) =>
    NextResponse.redirect(new URL(`/dang-nhap?error=${code}`, origin));

  if (!googleConfigured()) return fail("google_chua_cau_hinh");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = cookies().get("g_oauth_state")?.value;

  // Đối chiếu state chống CSRF.
  if (!code || !state || !savedState || state !== savedState) {
    return fail("google_that_bai");
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const accessToken = await exchangeCodeForToken(code, redirectUri);
    if (!accessToken) return fail("google_that_bai");

    const gUser = await getGoogleUser(accessToken);
    if (!gUser || !gUser.emailVerified) return fail("google_email_chua_xac_minh");

    // Khớp theo email: đã có thì đăng nhập, chưa có thì tạo mới (không mật khẩu).
    const existing = await prisma.user.findUnique({
      where: { email: gUser.email },
    });

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: existing.name ?? gUser.name ?? null,
            image: existing.image ?? gUser.picture ?? null,
          },
        })
      : await prisma.user.create({
          data: {
            email: gUser.email,
            name: gUser.name ?? null,
            image: gUser.picture ?? null,
            provider: "google",
            role: "user",
          },
        });

    const token = await createUserToken(user.id);
    const res = NextResponse.redirect(new URL("/tai-khoan", origin));
    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    // Xoá state đã dùng.
    res.cookies.set("g_oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("Google OAuth callback lỗi:", err);
    return fail("google_that_bai");
  }
}
