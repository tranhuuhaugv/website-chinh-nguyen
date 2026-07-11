import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

// Lưu banner hero + treo bên vào Setting ("heroBanners" / "sideBanners").
// Mỗi banner = { image, href }. Chỉ admin.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

function clean(raw: unknown): { image: string; href: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      const o = (x ?? {}) as { image?: unknown; href?: unknown };
      return {
        image: typeof o.image === "string" ? o.image.trim() : "",
        href: typeof o.href === "string" ? o.href.trim() : "",
      };
    })
    .filter((b) => b.image !== ""); // chỉ giữ slot có ảnh
}

async function saveSetting(key: string, value: unknown) {
  const v = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    update: { value: v },
    create: { key, value: v },
  });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    hero?: unknown;
    side?: unknown;
    sub?: unknown;
  } | null;

  const withDefault = (arr: { image: string; href: string }[]) =>
    arr.map((b) => ({ image: b.image, href: b.href || "/san-pham" }));

  const hero = withDefault(clean(body?.hero));
  const side = withDefault(clean(body?.side));
  const sub = withDefault(clean(body?.sub));

  await saveSetting("heroBanners", hero);
  await saveSetting("sideBanners", side);
  await saveSetting("subBanners", sub);

  return NextResponse.json({
    ok: true,
    hero: hero.length,
    side: side.length,
    sub: sub.length,
  });
}
