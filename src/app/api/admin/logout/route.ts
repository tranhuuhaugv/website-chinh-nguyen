import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { getBaseUrl } from "@/lib/base-url";

export async function POST(req: Request) {
  // Redirect về domain thật (https) — tránh cảnh báo "biểu mẫu không an toàn"
  // do req.url sau nginx là http://localhost:3000.
  const res = NextResponse.redirect(new URL("/admin-login", getBaseUrl(req)));
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
