import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(USER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
