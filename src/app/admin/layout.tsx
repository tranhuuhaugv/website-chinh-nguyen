import type { Metadata } from "next";
import Link from "next/link";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";

// Khu quản trị: layout riêng (không dùng header/footer khách hàng).
// Chặn index toàn bộ /admin.
export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Quản trị" },
  robots: { index: false, follow: false },
};

/** "Thứ Bảy, 04/10/2026" theo giờ Việt Nam. */
function todayLabel(): string {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <AdminMobileNav />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold text-ink">
                Trang quản trị
              </p>
              <p className="truncate text-[12px] capitalize text-muted max-[420px]:hidden">
                {todayLabel()}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-[13px]">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg px-2 py-1.5 font-medium text-green-d transition hover:bg-green-tint max-[420px]:hidden"
            >
              Xem cửa hàng ↗
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 font-medium text-ink-2 transition hover:border-sale hover:text-sale"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
