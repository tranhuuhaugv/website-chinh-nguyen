import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Nhận 1 ảnh (multipart) và lưu vào public/uploads trên VPS. Chỉ admin.
// Ảnh được phục vụ tĩnh tại /uploads/<tên>. Cần chạy trên Node runtime (dùng fs).
export const runtime = "nodejs";

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }

  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
