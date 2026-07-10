import { NextResponse } from "next/server";
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

  if (!checkAdminCredentials(body.email ?? "", body.password ?? "")) {
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
