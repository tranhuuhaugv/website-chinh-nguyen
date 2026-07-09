import type { Metadata } from "next";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Khu quản trị: layout riêng (không dùng header/footer khách hàng).
// Chặn index toàn bộ /admin.
export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Quản trị" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6">
          <span className="text-[15px] font-semibold text-ink">
            Trang quản trị
          </span>
          <div className="flex items-center gap-4 text-[13px]">
            <Link href="/" className="text-green-d hover:underline">
              ← Xem cửa hàng
            </Link>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-soft text-[13px] font-bold text-green">
              A
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
