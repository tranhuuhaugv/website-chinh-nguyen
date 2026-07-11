// Đăng nhập bằng Google (OAuth 2.0 Authorization Code flow).
// Dùng chung hệ thống phiên cookie (jose) sẵn có — không cần NextAuth.
//
// Cần 2 biến môi trường (.env):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
// Và khai báo Authorized redirect URI trên Google Cloud Console:
//   http://localhost:3000/api/auth/google/callback   (chạy thử local)
//   https://<domain>/api/auth/google/callback        (production)

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * URL gốc công khai của site — dùng để dựng redirect_uri gửi cho Google.
 * QUAN TRỌNG: trên VPS chạy sau nginx, `req.url` trả về địa chỉ nội bộ
 * (localhost:3000) nên KHÔNG dùng được. Ưu tiên header proxy chuyển tiếp,
 * rồi tới NEXT_PUBLIC_SITE_URL, cuối cùng mới tới origin của request (local dev).
 */
export function getBaseUrl(req: Request): string {
  const h = req.headers;
  const fwdHost = h.get("x-forwarded-host") || h.get("host") || "";

  // Local dev: luôn dùng đúng host của request (localhost:3000).
  if (fwdHost.startsWith("localhost") || fwdHost.startsWith("127.0.0.1")) {
    const proto = h.get("x-forwarded-proto") || "http";
    return `${proto}://${fwdHost}`;
  }

  // Production: dùng domain cấu hình sẵn cho chắc (khớp redirect URI đã khai báo).
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  // Dự phòng: dựng từ header proxy.
  if (fwdHost) {
    const proto = h.get("x-forwarded-proto") || "https";
    return `${proto}://${fwdHost}`;
  }

  return new URL(req.url).origin;
}

/** URL đưa khách sang trang đồng ý của Google. */
export function getGoogleAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/** Đổi authorization code lấy access token. */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<string | null> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export type GoogleUser = {
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
};

/** Lấy thông tin hồ sơ Google từ access token. */
export async function getGoogleUser(
  accessToken: string,
): Promise<GoogleUser | null> {
  const res = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const p = (await res.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };
  if (!p.email) return null;
  return {
    email: p.email.toLowerCase(),
    emailVerified: p.email_verified ?? false,
    name: p.name,
    picture: p.picture,
  };
}
