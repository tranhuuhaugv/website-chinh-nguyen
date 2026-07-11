// Tiện ích upload ảnh dùng chung cho các uploader trong admin.
// Có cấu hình Cloudinary (env) -> upload thật; chưa có -> trả URL xem trước tạm (demo).

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryReady = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export interface UploadResult {
  url: string;
  demo: boolean;
}

// Thu nhỏ + nén ảnh ngay trên trình duyệt trước khi upload để đỡ nặng, upload nhanh.
// Cloudinary/next/image vẫn tối ưu tiếp; đây chỉ để giảm dung lượng file gửi đi.
async function compress(file: File): Promise<Blob> {
  if (typeof document === "undefined") return file;
  // Chỉ nén ảnh raster và khi file đủ lớn (dưới ~500KB thì giữ nguyên).
  if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return file;
  if (file.size < 500 * 1024) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const MAX = 1600; // cạnh dài tối đa (px) — quá đủ cho web
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
  ctx.fillStyle = "#ffffff"; // nền trắng cho ảnh PNG trong suốt
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/jpeg", 0.82),
  );
  // Nếu nén xong không nhỏ hơn thì dùng file gốc.
  return blob && blob.size < file.size ? blob : file;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (!cloudinaryReady) {
    // Chế độ demo: chỉ xem trước tại chỗ, không lưu.
    return { url: URL.createObjectURL(file), demo: true };
  }

  const data = await compress(file);
  const form = new FormData();
  form.append("file", data, "upload.jpg");
  form.append("upload_preset", UPLOAD_PRESET as string);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("upload failed");
  const json = (await res.json()) as { secure_url: string };
  return { url: json.secure_url, demo: false };
}
