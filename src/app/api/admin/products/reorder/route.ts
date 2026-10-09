import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Lưu thứ tự sản phẩm NỔI BẬT (trang chủ). Body: { ids: string[] } theo thứ tự muốn hiện.
// Chỉ admin. Cột `sort` dùng chung toàn site (danh mục...), nên ta TÁI PHÂN PHỐI chính
// các giá trị sort đang có của nhóm này theo thứ tự mới -> máy ngoài nhóm không bị xáo.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids)
    ? Array.from(
        new Set(body.ids.filter((x): x is string => typeof x === "string")),
      )
    : [];
  if (ids.length === 0 || ids.length > 500) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const rows = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, sort: true },
    });
    if (rows.length !== ids.length) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }
    // Bộ giá trị sort sẵn có (tăng dần). Nếu bị trùng nhau (VD cùng = 0) thì không
    // phân biệt được thứ tự -> dùng 10, 20, 30... cho rõ ràng.
    const pool = rows.map((r) => r.sort).sort((a, b) => a - b);
    const distinct = new Set(pool).size === pool.length;
    const values = distinct ? pool : ids.map((_, i) => (i + 1) * 10);

    await prisma.$transaction(
      ids.map((id, i) =>
        prisma.product.update({ where: { id }, data: { sort: values[i] } }),
      ),
    );
    revalidateTag("site-data");
    revalidatePath("/");
    revalidatePath("/san-pham");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lưu thứ tự sản phẩm nổi bật lỗi:", err);
    return NextResponse.json(
      { ok: false, error: "save_failed" },
      { status: 500 },
    );
  }
}
