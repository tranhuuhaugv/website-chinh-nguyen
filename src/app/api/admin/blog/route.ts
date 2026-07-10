import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";

// CRUD bài viết blog cho khu admin (lưu thật vào DB). Chỉ admin đã đăng nhập.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

type Block = { type: "text" | "heading" | "image"; value: string };

// Chuẩn hoá nội dung gửi lên (chuỗi JSON của mảng khối, hoặc văn bản thô).
function normalizeContent(raw: unknown): Block[] {
  let arr: unknown = raw;
  if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      // không phải JSON -> coi như 1 đoạn văn
      return raw.trim() ? [{ type: "text", value: raw.trim() }] : [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((b): Block => {
      const o = (b ?? {}) as { type?: unknown; value?: unknown };
      const type =
        o.type === "heading" || o.type === "image" ? o.type : "text";
      return { type, value: String(o.value ?? "") };
    })
    .filter((b) => b.value.trim());
}

function readMinutes(blocks: Block[]): number {
  const words = blocks
    .filter((b) => b.type !== "image")
    .map((b) => b.value.trim().split(/\s+/).length)
    .reduce((a, b) => a + b, 0);
  return Math.max(1, Math.round(words / 200));
}

function formatDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const ACCENT_BY_TAG: Record<string, string> = {
  "Tư vấn": "green",
  "So sánh": "purple",
  "Thủ thuật": "blue",
  "Đánh giá": "blue",
};

// Sinh slug duy nhất (thêm hậu tố -2, -3... nếu trùng). excludeSlug: bỏ qua khi sửa.
async function uniqueSlug(base: string, excludeSlug?: string): Promise<string> {
  let slug = base || "bai-viet";
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.slug === excludeSlug) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || !String(body.title ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "missing_title" }, { status: 400 });
  }

  const title = String(body.title).trim();
  const tag = String(body.tag ?? "Tư vấn") || "Tư vấn";
  const content = normalizeContent(body.content);
  const base = slugify(String(body.slug ?? "").trim() || title);
  const slug = await uniqueSlug(base);

  await prisma.blogPost.create({
    data: {
      slug,
      title,
      tag,
      excerpt: String(body.excerpt ?? "").trim(),
      image: String(body.image ?? "").trim() || null,
      content: JSON.parse(JSON.stringify(content)),
      readMinutes: readMinutes(content),
      accent: ACCENT_BY_TAG[tag] ?? "green",
      date: formatDate(new Date()),
    },
  });

  return NextResponse.json({ ok: true, slug });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const originalSlug = String(body?.originalSlug ?? "").trim();
  if (!body || !originalSlug) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const current = await prisma.blogPost.findUnique({
    where: { slug: originalSlug },
  });
  if (!current) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const title = String(body.title ?? current.title).trim();
  const tag = String(body.tag ?? current.tag) || current.tag;
  const content = normalizeContent(body.content);
  const base = slugify(String(body.slug ?? "").trim() || title);
  const slug = await uniqueSlug(base, originalSlug);

  await prisma.blogPost.update({
    where: { slug: originalSlug },
    data: {
      slug,
      title,
      tag,
      excerpt: String(body.excerpt ?? "").trim(),
      image: String(body.image ?? "").trim() || null,
      content: JSON.parse(JSON.stringify(content)),
      readMinutes: readMinutes(content),
      accent: ACCENT_BY_TAG[tag] ?? current.accent,
    },
  });

  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.blogPost.delete({ where: { slug } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
