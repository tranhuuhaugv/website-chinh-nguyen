import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { isPcPartType } from "@/lib/pc-parts";

// CRUD linh kiện Build PC. Chỉ admin.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

const str = (v: unknown) => String(v ?? "").trim();
function money(v: unknown): number {
  const n = Number(str(v).replace(/[.,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}
function intOr(v: unknown, def: number): number {
  const n = Number(str(v));
  return Number.isFinite(n) ? Math.round(n) : def;
}
const firstImage = (v: unknown): string | null => {
  // Ô upload gửi chuỗi "url1,url2..." hoặc mảng — chỉ giữ 1 ảnh đại diện.
  if (Array.isArray(v)) return str(v[0]) || null;
  const s = str(v);
  return s ? s.split(",")[0].trim() || null : null;
};

// Dựng data chung từ body form.
function buildData(body: Record<string, unknown>) {
  const type = str(body.type);
  if (!isPcPartType(type)) return null;
  const name = str(body.name);
  if (!name) return null;
  return {
    type,
    name,
    price: money(body.price),
    brand: str(body.brand) || null,
    image: firstImage(body.image ?? body.images),
    note: str(body.note) || null,
    active: str(body.active) !== "khong",
    sort: intOr(body.sort, 0),
  };
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const data = body && buildData(body);
  if (!data) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  try {
    await prisma.pcPart.create({ data });
    revalidatePath("/build-pc");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tạo linh kiện lỗi:", err);
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = str(body?.id);
  const data = body && buildData(body);
  if (!id || !data) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  try {
    await prisma.pcPart.update({ where: { id }, data });
    revalidatePath("/build-pc");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cập nhật linh kiện lỗi:", err);
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
    await prisma.pcPart.delete({ where: { id } });
    revalidatePath("/build-pc");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Xoá linh kiện lỗi:", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
