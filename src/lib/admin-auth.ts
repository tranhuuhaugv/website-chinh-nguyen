import { SignJWT, jwtVerify } from "jose";

// Xác thực admin: cookie ký JWT. Middleware (edge) chỉ cần verify, không đụng DB.
// Đặt trong .env: ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET (chuỗi bí mật dài).

export const ADMIN_COOKIE = "admin_session";

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-secret-please-change",
  );
}

export async function createAdminToken(
  email?: string,
  name?: string,
): Promise<string> {
  return new SignJWT({ role: "admin", email: email ?? "", name: name ?? "" })
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

/**
 * TÊN admin để hiển thị "người thêm/sửa": ưu tiên `name` trong token; không có
 * thì lấy phần trước @ của email (khỏi lộ nguyên địa chỉ gmail). Null nếu token
 * cũ chưa có gì.
 */
export async function getAdminName(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const name = payload.name;
    if (typeof name === "string" && name.trim()) return name.trim();
    const email = payload.email;
    if (typeof email === "string" && email.includes("@")) {
      return email.split("@")[0];
    }
    return null;
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
