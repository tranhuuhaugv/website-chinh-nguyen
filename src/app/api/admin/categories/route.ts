import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";

// CRUD danh mục (lưu thật vào DB). Chỉ admin.
async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

async function uniqueSlug(base: string, exclude?: string): Promise<string> {
  let slug = base || "danh-muc";
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.slug === exclude) return slug;
    slug = `${base}-${i++}`;
  }
}

function done() {
  revalidatePath("/"); // trang chủ + mega-menu dùng danh mục
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const name = String(body?.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: "missing_name" }, { status: 400 });
  }
  const slug = await uniqueSlug(slugify(String(body?.slug ?? "").trim() || name));
  const last = await prisma.category.findFirst({ orderBy: { sort: "desc" } });

  await prisma.category.create({
    data: {
      name,
      slug,
      icon: String(body?.icon ?? "office") || "office",
      tag: String(body?.tag ?? "").trim() || null,
      image: String(body?.image ?? "").trim() || null,
      group: String(body?.group ?? "").trim() || null,
      sort: (last?.sort ?? 0) + 1,
    },
  });
  done();
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
  if (!originalSlug) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  const current = await prisma.category.findUnique({
    where: { slug: originalSlug },
  });
  if (!current) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const name = String(body?.name ?? current.name).trim();
  const slug = await uniqueSlug(
    slugify(String(body?.slug ?? "").trim() || name),
    originalSlug,
  );

  await prisma.category.update({
    where: { slug: originalSlug },
    data: {
      name,
      slug,
      icon: String(body?.icon ?? current.icon) || current.icon,
      tag: String(body?.tag ?? "").trim() || null,
      image: String(body?.image ?? "").trim() || null,
      group: String(body?.group ?? "").trim() || current.group,
    },
  });
  done();
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.category.delete({ where: { slug } }).catch(() => null);
  done();
  return NextResponse.json({ ok: true });
}
