import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";

// CRUD thương hiệu. Chỉ admin. KHÔNG cho xoá hãng đang còn sản phẩm.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = base || "thuong-hieu";
  let slug = root;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.brand.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${root}-${i++}`;
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = String(body?.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: "missing_name" }, { status: 400 });
  }
  const slug = await uniqueSlug(slugify(String(body?.slug ?? "").trim() || name));
  try {
    await prisma.brand.create({ data: { name, slug } });
    revalidatePath("/");
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("Tạo thương hiệu lỗi:", err);
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = String(body?.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  const current = await prisma.brand.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const name = String(body?.name ?? current.name).trim();
  const slug = await uniqueSlug(
    slugify(String(body?.slug ?? "").trim() || name),
    id,
  );
  try {
    await prisma.brand.update({ where: { id }, data: { name, slug } });
    revalidatePath("/");
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("Cập nhật thương hiệu lỗi:", err);
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  // Còn sản phẩm thì không cho xoá (tránh mất/hỏng dữ liệu sản phẩm).
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) {
    return NextResponse.json(
      { ok: false, error: "has_products", count },
      { status: 409 },
    );
  }
  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Xoá thương hiệu lỗi:", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
