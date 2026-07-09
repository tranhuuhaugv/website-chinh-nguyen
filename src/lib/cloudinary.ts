// Tiện ích upload ảnh dùng chung cho các uploader trong admin.
// Có cấu hình Cloudinary (env) -> upload thật; chưa có -> trả URL xem trước tạm (demo).

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryReady = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export interface UploadResult {
  url: string;
  demo: boolean;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  if (!cloudinaryReady) {
    // Chế độ demo: chỉ xem trước tại chỗ, không lưu.
    return { url: URL.createObjectURL(file), demo: true };
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET as string);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("upload failed");
  const data = (await res.json()) as { secure_url: string };
  return { url: data.secure_url, demo: false };
}
