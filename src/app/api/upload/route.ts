import { NextResponse } from "next/server";
import {
  IMAGE_EXT,
  MAX_IMAGE_BYTES,
  requireAdmin,
  saveImage,
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
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await saveImage(buffer, ext);

  return NextResponse.json({ ok: true, url });
}
