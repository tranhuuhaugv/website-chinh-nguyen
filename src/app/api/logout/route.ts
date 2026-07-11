import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/session";
import { getBaseUrl } from "@/lib/base-url";

export async function POST(req: Request) {
  // Redirect về domain thật (https). KHÔNG dùng req.url vì sau nginx nó là
  // http://localhost:3000 -> Chrome cảnh báo "biểu mẫu không an toàn".
  const res = NextResponse.redirect(new URL("/", getBaseUrl(req)));
  res.cookies.set(USER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
