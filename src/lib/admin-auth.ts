import { SignJWT, jwtVerify } from "jose";

// Xác thực admin: cookie ký JWT. Middleware (edge) chỉ cần verify, không đụng DB.
// Đặt trong .env: ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET (chuỗi bí mật dài).

export const ADMIN_COOKIE = "admin_session";

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-secret-please-change",
  );
}

export async function createAdminToken(email?: string): Promise<string> {
  return new SignJWT({ role: "admin", email: email ?? "" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/** Email admin trong token (để biết ai sửa). Rỗng nếu token cũ chưa có email. */
export async function getAdminEmail(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const email = payload.email;
    return typeof email === "string" && email ? email : null;
  } catch {
    return null;
  }
}

export function checkAdminCredentials(
  email: string,
  password: string,
): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}
