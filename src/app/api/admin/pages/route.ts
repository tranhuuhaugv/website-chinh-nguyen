import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import {
  EDITABLE_PAGES,
  INFO_PAGES,
  POLICIES,
  isFixedPage,
  isValidPageSlug,
} from "@/lib/policies";

// Lưu nội dung trang nội dung (chính sách + giới thiệu/liên hệ) vào DB. Chỉ admin.

async function requireAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token ? verifyAdminToken(token) : false;
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
}

const POLICY_SLUGS_SETTING = "policySlugs";

function cleanPolicySlugMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const map: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const slug = String(value ?? "").trim();
    if (POLICIES[key] && isValidPageSlug(slug)) map[key] = slug;
  }
  return map;
}

async function getPolicySlugMap(): Promise<Record<string, string>> {
  const s = await prisma.setting.findUnique({ where: { key: POLICY_SLUGS_SETTING } });
  try {
    return cleanPolicySlugMap(s ? JSON.parse(s.value) : {});
  } catch {
    return {};
  }
}

async function savePolicySlugMap(map: Record<string, string>) {
  await prisma.setting.upsert({
    where: { key: POLICY_SLUGS_SETTING },
    update: { value: JSON.stringify(map) },
    create: { key: POLICY_SLUGS_SETTING, value: JSON.stringify(map) },
  });
}

function pagePath(id: string, map: Record<string, string>): string {
  if (POLICIES[id]) return `/chinh-sach/${map[id] ?? id}`;
  if (INFO_PAGES[id]) return `/${id}`;
  return `/chinh-sach/${id}`;
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: {
    id?: string;
    slug?: string;
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
  const nextId = String(body.slug ?? body.id ?? "").trim();
  // Cho sửa/tạo: trang cố định (chính sách/giới thiệu/liên hệ) HOẶC slug hợp lệ
  // (trang tuỳ chỉnh admin tự tạo -> upsert vào bảng Page).
  if (!id || (!EDITABLE_PAGES[id] && !isValidPageSlug(id))) {
    return NextResponse.json({ ok: false, error: "invalid_page" }, { status: 400 });
  }
  if (INFO_PAGES[id] && nextId !== id) {
    return NextResponse.json({ ok: false, error: "fixed_page_slug" }, { status: 400 });
  }
  if (!isValidPageSlug(nextId) || (isFixedPage(nextId) && nextId !== id)) {
    return NextResponse.json({ ok: false, error: "invalid_slug" }, { status: 400 });
  }
  const policySlugMap = await getPolicySlugMap();
  const oldPolicyPublicSlug = policySlugMap[id] ?? id;
  const slugUsedByPolicy = Object.entries(policySlugMap).some(
    ([policyId, publicSlug]) => policyId !== id && publicSlug === nextId,
  );
  if (slugUsedByPolicy) {
    return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 409 });
  }

  const title =
    String(body.title ?? "").trim() || EDITABLE_PAGES[id]?.title || nextId;
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
    if (POLICIES[id]) {
      await prisma.page.upsert({
        where: { id },
        update: { title, lead, content: { intro, sections } },
        create: { id, title, lead, content: { intro, sections } },
      });
      if (nextId === id) {
        delete policySlugMap[id];
      } else {
        const exists = await prisma.page.findUnique({ where: { id: nextId } });
        if (exists) {
          return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 409 });
        }
        policySlugMap[id] = nextId;
      }
      await savePolicySlugMap(policySlugMap);
    } else if (!isFixedPage(id) && nextId !== id) {
      const exists = await prisma.page.findUnique({ where: { id: nextId } });
      if (exists) {
        return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 409 });
      }
      const current = await prisma.page.findUnique({ where: { id } });
      if (current) {
        await prisma.page.update({
          where: { id },
          data: { id: nextId, title, lead, content: { intro, sections } },
        });
      } else {
        await prisma.page.create({
          data: { id: nextId, title, lead, content: { intro, sections } },
        });
      }
    } else {
      await prisma.page.upsert({
        where: { id },
        update: { title, lead, content: { intro, sections } },
        create: { id, title, lead, content: { intro, sections } },
      });
    }
    revalidatePath(pagePath(id, policySlugMap));
    revalidatePath(`/chinh-sach/${oldPolicyPublicSlug}`);
    revalidatePath(`/chinh-sach/${id}`);
    revalidatePath(`/chinh-sach/${nextId}`);
    if (nextId !== id) revalidatePath(`/trang/${id}`);
    return NextResponse.json({
      ok: true,
      id,
      path: POLICIES[id] ? pagePath(id, policySlugMap) : pagePath(nextId, policySlugMap),
    });
  } catch (err) {
    console.error("Lưu trang chính sách lỗi:", err);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}

// Xoá 1 trang TUỲ CHỈNH (không cho xoá trang cố định trong code).
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id || isFixedPage(id)) {
    return NextResponse.json({ ok: false, error: "not_deletable" }, { status: 400 });
  }
  try {
    await prisma.page.delete({ where: { id } });
  } catch {
    // đã xoá / không tồn tại -> coi như xong
  }
  revalidatePath(`/chinh-sach/${id}`);
  revalidatePath(`/trang/${id}`);
  return NextResponse.json({ ok: true });
}
