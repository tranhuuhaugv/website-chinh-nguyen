/**
 * URL gốc công khai của site (vd https://laptopchinhnguyen.com.vn).
 *
 * QUAN TRỌNG: trên VPS chạy sau nginx reverse proxy, `req.url` trả về địa chỉ
 * nội bộ (http://localhost:3000) — KHÔNG dùng để dựng redirect/redirect_uri được
 * (sai host + là http → Chrome cảnh báo "biểu mẫu không an toàn", OAuth trả sai chỗ).
 * Ưu tiên: local dev dùng host thật của request; production dùng NEXT_PUBLIC_SITE_URL;
 * dự phòng dựng từ header proxy.
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
