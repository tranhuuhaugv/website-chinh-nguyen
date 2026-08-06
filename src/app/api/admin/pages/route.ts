import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { EDITABLE_PAGES, pagePublicPath } from "@/lib/policies";

// Lưu nội dung trang nội dung (chính sách + giới thiệu/liên hệ) vào DB. Chỉ admin.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: {
    id?: string;
    title?: string;
    lead?: string;
    intro?: unknown;
    sections?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  // Chỉ cho sửa các trang nội dung hợp lệ (chính sách + giới thiệu/liên hệ).
  if (!id || !EDITABLE_PAGES[id]) {
    return NextResponse.json({ ok: false, error: "invalid_page" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim() || EDITABLE_PAGES[id].title;
  const lead = String(body.lead ?? "").trim();
  const intro = strArray(body.intro);
  const sections = Array.isArray(body.sections)
    ? body.sections
        .map((s) => {
          const o = (s ?? {}) as {
            heading?: unknown;
            paragraphs?: unknown;
            items?: unknown;
          };
          return {
            heading: String(o.heading ?? "").trim(),
            paragraphs: strArray(o.paragraphs),
            items: strArray(o.items),
          };
        })
        .filter((s) => s.heading || s.paragraphs.length || s.items.length)
    : [];

  try {
    await prisma.page.upsert({
      where: { id },
      update: { title, lead, content: { intro, sections } },
      create: { id, title, lead, content: { intro, sections } },
    });
    revalidatePath(pagePublicPath(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lưu trang chính sách lỗi:", err);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
