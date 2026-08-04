// Upload ảnh lên chính VPS (tự host, không dùng dịch vụ ngoài).
// Chạy phía trình duyệt: nén ảnh rồi POST tới /api/upload, nhận URL /uploads/...

export interface UploadResult {
  url: string;
  demo: boolean;
}

// CHỈ thu nhỏ ảnh quá lớn trước khi gửi (để upload đỡ nặng), GIỮ chất lượng cao.
// Phần nén thật (sang WebP) do server làm 1 lần duy nhất (lib/upload-server.ts) —
// nén ở client rồi server nén lại = nén 2 lần, ảnh sẽ mờ. Vì thế ở đây dùng
// chất lượng cao (0.92, gần như không thấy khác) và chỉ đụng vào ảnh lớn.
async function compress(file: File): Promise<Blob> {
  if (typeof document === "undefined") return file;
  if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return file; // gif... giữ nguyên

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const MAX = 1600;
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  // Ảnh đã nhỏ (không cần thu) và dưới ~2MB -> gửi thẳng, khỏi mã hoá lại cho khỏi hao nét.
  if (scale === 1 && file.size < 2 * 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/jpeg", 0.92),
  );
  return blob && blob.size < file.size ? blob : file;
}

/** Lỗi tải ảnh từ link, kèm thông báo tiếng Việt để hiện thẳng cho admin. */
const URL_ERRORS: Record<string, string> = {
  bad_url: "Link không hợp lệ",
  bad_protocol: "Chỉ nhận link http/https",
  private_host: "Link trỏ vào địa chỉ nội bộ",
  dns_failed: "Không tìm thấy tên miền",
  bad_redirect: "Link chuyển hướng lỗi",
  too_many_redirects: "Link chuyển hướng quá nhiều lần",
  fetch_failed: "Không tải được ảnh từ link này",
  bad_type: "Link không phải ảnh (jpg/png/webp/gif/avif)",
  too_large: "Ảnh nặng quá 8MB",
  empty: "Ảnh rỗng",
};

/**
 * Tải ảnh từ LINK WEB về VPS (server đi tải, không phải trình duyệt) rồi trả về
 * URL /uploads/... như upload thường. Ảnh không đi qua bước nén ở client.
 */
export async function uploadImageFromUrl(
  url: string,
  opts?: { raw?: boolean },
): Promise<UploadResult> {
  const res = await fetch("/api/upload/from-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, raw: opts?.raw ? 1 : undefined }),
  });
  const json = (await res.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;
  if (!res.ok || !json?.url) {
    throw new Error(URL_ERRORS[json?.error ?? ""] ?? "Không tải được ảnh");
  }
  return { url: json.url, demo: false };
}

export async function uploadImage(
  file: File,
  opts?: { raw?: boolean },
): Promise<UploadResult> {
  // raw = giữ nguyên gốc (không nén ở client lẫn server). Cho ảnh cần nét tối đa.
  const data = opts?.raw ? file : await compress(file);
  const form = new FormData();
  form.append("file", data, "upload");
  if (opts?.raw) form.append("raw", "1");

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("upload failed");
  const json = (await res.json()) as { url: string };
  return { url: json.url, demo: false };
}
