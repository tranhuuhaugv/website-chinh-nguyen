import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Bảo vệ toàn bộ khu /admin: chưa đăng nhập -> chuyển tới trang đăng nhập admin.
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const valid = token ? await verifyAdminToken(token) : false;

  if (!valid) {
    const url = new URL("/admin-login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
