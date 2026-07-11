import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { googleConfigured, getGoogleAuthUrl } from "@/lib/google";

export const dynamic = "force-dynamic";

// Bước 1: chuyển hướng khách sang Google để đồng ý đăng nhập.
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;

  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL("/dang-nhap?error=google_chua_cau_hinh", origin),
    );
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const state = randomUUID();
  const authUrl = getGoogleAuthUrl(redirectUri, state);

  const res = NextResponse.redirect(authUrl);
  // state chống CSRF — đối chiếu ở callback.
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 phút
  });
  return res;
}
