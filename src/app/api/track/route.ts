import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ghi nhận 1 lượt xem trang (công khai). Bỏ qua trang admin. Cần Node runtime.
export const runtime = "nodejs";

const NO_DB = !process.env.DATABASE_URL;

// Ngày theo giờ Việt Nam (UTC+7): YYYY-MM-DD.
function vnDate(): string {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  if (NO_DB) return NextResponse.json({ ok: true });

  const body = (await req.json().catch(() => null)) as {
    vid?: unknown;
    path?: unknown;
  } | null;
  const path = typeof body?.path === "string" ? body.path : "";
  if (path.startsWith("/admin")) return NextResponse.json({ ok: true });

  try {
    const date = vnDate();
    await prisma.dailyView.upsert({
      where: { date },
      update: { count: { increment: 1 } },
      create: { date, count: 1 },
    });

    const vid = typeof body?.vid === "string" ? body.vid.slice(0, 64) : "";
    if (vid) {
      await prisma.activeVisitor.upsert({
        where: { id: vid },
        update: { lastSeen: new Date() },
        create: { id: vid, lastSeen: new Date() },
      });
    }

    // Dọn phiên cũ thỉnh thoảng (không phải mỗi request).
    if (Math.random() < 0.05) {
      await prisma.activeVisitor.deleteMany({
        where: { lastSeen: { lt: new Date(Date.now() - 30 * 60 * 1000) } },
      });
    }
  } catch {
    // không chặn trải nghiệm khách nếu ghi thống kê lỗi
  }

  return NextResponse.json({ ok: true });
}
