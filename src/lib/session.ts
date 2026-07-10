import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Phiên đăng nhập của KHÁCH HÀNG (cookie ký JWT, riêng với admin).
export const USER_COOKIE = "user_session";

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-secret-please-change",
  );
}

export async function createUserToken(uid: string): Promise<string> {
  return new SignJWT({ uid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

/** Đọc user hiện đang đăng nhập từ cookie (null nếu chưa đăng nhập). */
export async function getCurrentUser() {
  const token = cookies().get(USER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const uid = payload.uid as string | undefined;
    if (!uid) return null;
    return prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
  } catch {
    return null;
  }
}
