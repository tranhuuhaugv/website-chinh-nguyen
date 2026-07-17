import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Phần dùng chung cho các route upload ảnh (chạy Node runtime vì dùng fs).

/** Kiểu ảnh cho phép -> đuôi file lưu trên đĩa. */
export const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Cạnh dài tối đa sau khi nén (px). Đủ nét cho zoom ảnh chi tiết, vẫn nhẹ. */
const MAX_EDGE = 1600;
/** Chất lượng WebP (0-100). ~78 gần như không thấy khác mắt thường mà nhẹ. */
const WEBP_QUALITY = 78;

export async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

async function writeToUploads(buffer: Buffer, ext: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

/**
 * Lưu ảnh vào public/uploads, trả về đường dẫn phục vụ tĩnh (/uploads/...).
 *
 * Tối ưu NGAY trên VPS bằng sharp: xoay đúng chiều theo EXIF, thu nhỏ về tối đa
 * 1600px, đổi sang WebP -> file gốc nhẹ đi ~5-10 lần. Nhờ đó next/image cắt cỡ
 * hiển thị rất nhanh và ảnh tải nhẹ cho khách. GIF (ảnh động) giữ nguyên để
 * không mất animation. Sharp lỗi (ảnh hỏng...) -> lưu nguyên bản, không chặn upload.
 */
export async function saveImage(buffer: Buffer, ext: string): Promise<string> {
  if (ext === "gif") return writeToUploads(buffer, "gif");

  try {
    const webp = await sharp(buffer)
      .rotate() // theo EXIF orientation, tránh ảnh bị xoay ngang
      .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    return writeToUploads(webp, "webp");
  } catch (err) {
    console.error("Nén ảnh (sharp) lỗi, lưu nguyên bản:", err);
    return writeToUploads(buffer, ext);
  }
}
