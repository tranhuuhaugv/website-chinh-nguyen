// Upload ảnh lên chính VPS (tự host, không dùng dịch vụ ngoài).
// Chạy phía trình duyệt: nén ảnh rồi POST tới /api/upload, nhận URL /uploads/...

export interface UploadResult {
  url: string;
  demo: boolean;
}

// Thu nhỏ + nén ảnh trước khi gửi để nhẹ, upload nhanh, đỡ tốn ổ VPS.
async function compress(file: File): Promise<Blob> {
  if (typeof document === "undefined") return file;
  if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return file; // gif... giữ nguyên
  if (file.size < 500 * 1024) return file; // đã nhỏ thì thôi

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const MAX = 1600;
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
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
    canvas.toBlob(res, "image/jpeg", 0.82),
  );
  return blob && blob.size < file.size ? blob : file;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const data = await compress(file);
  const form = new FormData();
  form.append("file", data, "upload");

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("upload failed");
  const json = (await res.json()) as { url: string };
  return { url: json.url, demo: false };
}
