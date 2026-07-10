import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UserIcon } from "@/components/icons";

// Khung trang tài khoản: sidebar (avatar + menu) + nội dung. Server Component.

const NAV = [
  { label: "Thông tin tài khoản", href: "/tai-khoan" },
  { label: "Đơn hàng của tôi", href: "/tai-khoan/don-hang" },
];

export function AccountShell({
  activeHref,
  crumbLabel,
  title,
  userName,
  children,
}: {
  activeHref: string;
  crumbLabel: string;
  title: string;
  userName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Tài khoản", href: "/tai-khoan" },
              { label: crumbLabel },
            ]}
          />
          <h1 className="mb-5 mt-3 text-[26px] font-bold text-ink">{title}</h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center gap-3 border-b border-line px-2 pb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-soft text-green">
                  <UserIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">
                    {userName ?? "Khách"}
                  </p>
                  <p className="text-[12px] text-muted">
                    {userName ? "Đã đăng nhập" : "Chưa đăng nhập"}
                  </p>
                </div>
              </div>
              <nav className="mt-2 flex flex-col">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-lg px-3 py-2.5 text-[13.5px] transition ${
                      n.href === activeHref
                        ? "bg-green-tint font-semibold text-green-d"
                        : "text-ink-2 hover:bg-bg"
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
                <form action="/api/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-[13.5px] text-sale transition hover:bg-bg"
                  >
                    Đăng xuất
                  </button>
                </form>
              </nav>
            </aside>

            <div className="flex flex-col gap-6">{children}</div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
