// Xử lý link / iframe Google Map của cửa hàng. Chỉ nhận địa chỉ Google hợp lệ,
// KHÔNG bao giờ render HTML do admin dán vào (chỉ lấy `src` rồi tự dựng iframe).

const LINK_HOSTS = [
  "maps.app.goo.gl",
  "goo.gl",
  "g.page",
  "google.com",
  "www.google.com",
  "maps.google.com",
];

/** Link Google Map (VD https://maps.app.goo.gl/xxxx). Sai/không phải Google -> "". */
export function cleanMapUrl(raw: unknown): string {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return "";
  try {
    const u = new URL(s);
    return u.protocol === "https:" && LINK_HOSTS.includes(u.hostname) ? u.toString() : "";
  } catch {
    return "";
  }
}

/**
 * Nhận cả CẢ đoạn `<iframe src="...">` lẫn URL embed thuần, trả về src embed
 * (https://www.google.com/maps/embed?...). Không hợp lệ -> "".
 */
export function extractEmbedSrc(raw: unknown): string {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return "";
  const m = /src\s*=\s*["']([^"']+)["']/i.exec(s);
  const src = (m ? m[1] : s).replace(/&amp;/g, "&").trim();
  return src.startsWith("https://www.google.com/maps/embed") ? src : "";
}

/** Link chỉ đường: ưu tiên link admin nhập; không có -> tự tìm theo địa chỉ. */
export function directionsUrl(store: { address: string; name: string; mapUrl?: string }): string {
  if (store.mapUrl) return store.mapUrl;
  const q = encodeURIComponent(`${store.name} ${store.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
