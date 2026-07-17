import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { richTextRong, sanitizeRichText } from "@/lib/rich-text";

// CRUD sản phẩm (lưu thật vào DB). Chỉ admin đã đăng nhập.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

type Body = Record<string, unknown>;

const str = (v: unknown) => String(v ?? "").trim();
/** Số: bỏ dấu chấm/phẩy phân cách. Rỗng -> null. */
function num(v: unknown): number | null {
  const s = str(v).replace(/[.,\s]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
/** Chuỗi "a,b,c" -> ["a","b","c"] */
const list = (v: unknown) =>
  str(v)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

/**
 * Link máy cùng dòng -> mảng slug. Admin dán kiểu gì cũng nhận:
 * link đầy đủ (https://.../san-pham/abc), đường dẫn (/san-pham/abc) hay slug trần.
 * Cách nhau bằng dấu phẩy / xuống dòng / dấu cách.
 */
function variantSlugs(v: unknown, selfSlug?: string): string[] {
  const out = str(v)
    .split(/[\s,\n]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      // Bỏ query/hash rồi lấy đoạn cuối của đường dẫn.
      const clean = x.split(/[?#]/)[0].replace(/\/+$/, "");
      const last = clean.split("/").filter(Boolean).pop() ?? "";
      return last.toLowerCase();
    })
    .filter((s) => s && s !== selfSlug); // không tự nối vào chính nó
  return Array.from(new Set(out));
}

/**
 * Mô tả: form gửi lên HTML (CKEditor). LỌC NGAY khi lưu — không tin dữ liệu
 * gửi lên, kể cả từ admin (tài khoản admin có thể bị chiếm).
 * Rỗng (CKEditor trống trả "<p>&nbsp;</p>") -> "" = coi như chưa soạn mô tả.
 */
function richText(v: unknown): string {
  const s = sanitizeRichText(str(v));
  return richTextRong(s) ? "" : s;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = base || "san-pham";
  let slug = root;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${root}-${i++}`;
  }
}

/** Lấy brandId từ tên hãng (tạo mới nếu chưa có). */
async function brandIdFor(name: string): Promise<string | null> {
  const n = name.trim();
  if (!n) return null;
  const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const brand = await prisma.brand.upsert({
    where: { slug },
    update: {},
    create: { name: n, slug },
  });
  return brand.id;
}

/** Dựng data chung cho create/update từ body form. `selfSlug` để không tự nối vào mình. */
async function buildData(body: Body, selfSlug: string) {
  const brandId = await brandIdFor(str(body.brand));
  if (!brandId) return null;
  return {
    name: str(body.name),
    brandId,
    price: num(body.price) ?? 0,
    oldPrice: num(body.oldPrice),
    cpu: str(body.cpu),
    ram: str(body.ram),
    storage: str(body.storage),
    gpu: str(body.gpu) || null,
    screen: str(body.screen) || null,
    resolution: str(body.resolution) || null,
    refresh: str(body.refresh) || null,
    os: str(body.os) || null,
    battery: str(body.battery) || null,
    weight: str(body.weight) || null,
    ports: str(body.ports) || null,
    warranty: str(body.warranty) || null,
    condition: str(body.condition) === "new" ? "new" : "used",
    needs: list(body.needs),
    images: list(body.images),
    variantSlugs: variantSlugs(body.variantLinks, selfSlug),
    description: richText(body.description),
    gift: str(body.gift) || null,
    badge: str(body.badge) || null,
    isNew: str(body.isNew) === "co",
    isFeatured: str(body.isFeatured) === "co",
    isFlashSale: str(body.isFlashSale) === "co",
    accent: str(body.accent) || "dark",
    installmentPerMonth: num(body.installmentPerMonth),
    metaTitle: str(body.metaTitle) || null,
    metaDescription: str(body.metaDescription) || null,
    sort: num(body.sort) ?? 0,
  };
}

/**
 * `lienQuan`: slug các máy mà nút "Dung lượng" của chúng ĐANG hiện thông số của
 * máy này (tức các máy nối TỚI nó) -> sửa máy này thì trang chúng cũng phải làm
 * mới, không thì nút bên đó còn ghi RAM/ổ cứng cũ.
 */
function done(slug?: string, lienQuan: string[] = []) {
  revalidatePath("/");
  revalidatePath("/san-pham");
  if (slug) revalidatePath(`/san-pham/${slug}`);
  lienQuan.forEach((s) => revalidatePath(`/san-pham/${s}`));
}

/** Các máy đang nối TỚI slug này (nút của chúng hiện thông số máy này). */
async function mayNoiToi(slug: string): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { variantSlugs: { has: slug } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const name = str(body.name);
  if (!name) {
    return NextResponse.json({ ok: false, error: "missing_name" }, { status: 400 });
  }
  const slug = await uniqueSlug(slugify(str(body.slug) || name));
  const data = await buildData(body, slug);
  if (!data) {
    return NextResponse.json({ ok: false, error: "missing_brand" }, { status: 400 });
  }
  try {
    await prisma.product.create({ data: { ...data, slug } });
    done(slug);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("Tạo sản phẩm lỗi:", err);
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Body | null;
  const id = str(body?.id);
  if (!body || !id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const slug = await uniqueSlug(
    slugify(str(body.slug) || str(body.name) || current.slug),
    id,
  );
  const data = await buildData(body, slug);
  if (!data) {
    return NextResponse.json({ ok: false, error: "missing_brand" }, { status: 400 });
  }
  try {
    await prisma.product.update({ where: { id }, data: { ...data, slug } });
    // Máy khác đang nối tới máy này -> nút bên đó hiện RAM/ổ cứng của máy này,
    // sửa xong phải làm mới trang chúng.
    done(slug, await mayNoiToi(current.slug));
    if (slug !== current.slug) revalidatePath(`/san-pham/${current.slug}`);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("Cập nhật sản phẩm lỗi:", err);
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const p = await prisma.product.delete({ where: { id } });
    // Máy khác đang nối tới máy vừa xoá -> gỡ link ra khỏi chúng (không thì form
    // của chúng còn link tới máy đã mất) + làm mới trang để bỏ nút chọn, tránh
    // khách bấm vào nút đó ra trang 404.
    const linkers = await prisma.product.findMany({
      where: { variantSlugs: { has: p.slug } },
      select: { id: true, slug: true, variantSlugs: true },
    });
    await Promise.all(
      linkers.map((l) =>
        prisma.product.update({
          where: { id: l.id },
          data: { variantSlugs: l.variantSlugs.filter((s) => s !== p.slug) },
        }),
      ),
    );
    done(
      p.slug,
      linkers.map((l) => l.slug),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Xoá sản phẩm lỗi:", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
