import DOMPurify, { type Config } from "isomorphic-dompurify";

// Nội dung mô tả SP / bài viết giờ lưu HTML (CKEditor). Dữ liệu CŨ lưu dạng
// mảng khối [{type,value}] -> tự đổi sang HTML khi đọc, không phải sửa tay.

/** Chặn ký tự đặc biệt khi dựng HTML từ dữ liệu khối cũ (chữ thuần). */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Thẻ/thuộc tính cho phép trong nội dung. Chỉ mở đúng những gì CKEditor sinh ra
 * (theo bộ nút đã bật) — KHÔNG mở rộng thêm nếu chưa cần.
 * KHÔNG có: script, iframe, style, on* handler, javascript: URL.
 */
const CAU_HINH_LOC: Config = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "h2", "h3", "h4",
    "ul", "ol", "li",
    "blockquote",
    "a",
    "figure", "figcaption", "img",
    "table", "thead", "tbody", "tr", "td", "th",
    "span", "div",
  ],
  ALLOWED_ATTR: [
    "href", "target", "rel",
    "src", "alt", "width", "height",
    "class", "style", "id", // id: để gắn neo mục lục (bocMucLuc)
    "colspan", "rowspan",
  ],
  // Ảnh/link chỉ cho đường dẫn nội bộ hoặc http(s) — chặn javascript:, data:.
  ALLOWED_URI_REGEXP: /^(?:https?:|\/(?!\/)|#)/i,
};

/** Lọc HTML trước khi đổ ra trang khách (chống XSS). Chạy được cả server lẫn client. */
export function sanitizeRichText(html: string): string {
  // Kiểu trả về là TrustedHTML (Trusted Types) -> ép về string cho React dùng.
  return String(DOMPurify.sanitize(html, CAU_HINH_LOC));
}

/**
 * Chuẩn hoá nội dung từ DB (cột Json) về chuỗi HTML.
 *  - Dữ liệu MỚI: đã là chuỗi HTML -> giữ nguyên.
 *  - Dữ liệu CŨ: mảng khối [{type,value}] hoặc mảng chuỗi -> dựng HTML tương ứng.
 * Kết quả LUÔN được lọc, kể cả dữ liệu cũ (an toàn hơn là tin dữ liệu trong DB).
 *
 * `theTieuDe`: khối "heading" cũ đổi thành thẻ gì — phải khớp cấp bậc của trang:
 *  - Blog: h1 = tên bài -> mục dùng h2 (mặc định).
 *  - Trang SP: h1 = tên máy, h2 = "Mô tả sản phẩm" -> mục bên trong dùng h3.
 */
export function toRichHtml(raw: unknown, theTieuDe: "h2" | "h3" = "h2"): string {
  if (typeof raw === "string") return sanitizeRichText(raw);

  if (Array.isArray(raw)) {
    const html = raw
      .map((b) => {
        if (typeof b === "string") {
          return b.trim() ? `<p>${escapeHtml(b)}</p>` : "";
        }
        if (!b || typeof b !== "object") return "";
        const o = b as { type?: unknown; value?: unknown };
        const value = String(o.value ?? "").trim();
        if (!value) return "";
        if (o.type === "heading") {
          return `<${theTieuDe}>${escapeHtml(value)}</${theTieuDe}>`;
        }
        if (o.type === "image") {
          return `<figure class="image"><img src="${escapeHtml(value)}" alt=""></figure>`;
        }
        return `<p>${escapeHtml(value)}</p>`;
      })
      .join("");
    return sanitizeRichText(html);
  }

  return "";
}

/** Nội dung có chữ thật không (bỏ thẻ đi còn gì không) — để quyết định hiện/ẩn. */
export function richTextRong(html: string): boolean {
  return !richTextToText(html) && !/<img\b/i.test(html);
}

/** 1 mục trong mục lục bài viết. */
export interface MucLuc {
  id: string;
  text: string;
}

/**
 * Bóc tiêu đề (h2/h3) làm mục lục + gắn id vào chính các thẻ đó để bấm nhảy tới.
 * Trả về HTML đã gắn id, nên trang blog phải render HTML NÀY (không phải bản gốc).
 */
export function bocMucLuc(html: string): { html: string; mucLuc: MucLuc[] } {
  const mucLuc: MucLuc[] = [];
  let n = 0;
  const out = html.replace(
    /<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (khop, the: string, thuocTinh: string | undefined, ruot: string) => {
      const text = richTextToText(ruot);
      if (!text) return khop;
      const id = `muc-${n++}`;
      mucLuc.push({ id, text });
      // Thẻ có sẵn id -> giữ nguyên, khỏi ghi đè.
      if (thuocTinh && /\sid\s*=/i.test(thuocTinh)) return khop;
      return `<${the}${thuocTinh ?? ""} id="${id}">${ruot}</${the}>`;
    },
  );
  return { html: out, mucLuc };
}

/**
 * Bỏ thẻ HTML -> chữ thuần. Dùng cho chỗ KHÔNG được có thẻ:
 * meta description, Schema.org, trích dẫn ngắn.
 */
export function richTextToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
