import { NextResponse } from "next/server";
import {
  IMAGE_EXT,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_BYTES_RAW,
  requireAdmin,
  saveImage,
  saveImageOriginal,
} from "@/lib/upload-server";

// Nhận 1 ảnh (multipart) và lưu vào public/uploads trên VPS. Chỉ admin.
// Ảnh được phục vụ tĩnh tại /uploads/<tên>. Cần chạy trên Node runtime (dùng fs).
// Tải ảnh từ link web -> xem /api/upload/from-url.
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }

  const ext = IMAGE_EXT[file.type];
  if (!ext) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 400 });
  }
  // raw = giữ nguyên gốc (không nén). Cho phép ảnh nặng hơn.
  const raw = form?.get("raw") === "1";
  const limit = raw ? MAX_IMAGE_BYTES_RAW : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = raw ? await saveImageOriginal(buffer, ext) : await saveImage(buffer, ext);

  return NextResponse.json({ ok: true, url });
}
