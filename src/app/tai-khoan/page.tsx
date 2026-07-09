import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UserIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  robots: { index: false, follow: false },
};

const NAV = [
  { label: "Thông tin tài khoản", href: "/tai-khoan", active: true },
  { label: "Đơn hàng của tôi", href: "/tai-khoan/don-hang" },
  { label: "Sổ địa chỉ", href: "/tai-khoan/dia-chi" },
];

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Tài khoản" }]}
          />
          <h1 className="mb-5 mt-3 text-[26px] font-bold text-ink">
            Tài khoản của tôi
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            {/* Menu */}
            <aside className="h-fit rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center gap-3 border-b border-line px-2 pb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-soft text-green">
                  <UserIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Khách</p>
                  <p className="text-[12px] text-muted">Chưa đăng nhập</p>
                </div>
              </div>
              <nav className="mt-2 flex flex-col">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-lg px-3 py-2.5 text-[13.5px] transition ${
                      n.active
                        ? "bg-green-tint font-semibold text-green-d"
                        : "text-ink-2 hover:bg-bg"
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  href="/dang-nhap"
                  className="rounded-lg px-3 py-2.5 text-[13.5px] text-sale transition hover:bg-bg"
                >
                  Đăng xuất
                </Link>
              </nav>
            </aside>

            {/* Nội dung */}
            <div className="flex flex-col gap-6">
              <div className="rounded-lg bg-green-tint px-4 py-3 text-[13px] text-green-d">
                Đây là giao diện tài khoản (demo). Đăng nhập/đăng ký thật sẽ hoạt
                động khi kết nối NextAuth + database.
              </div>

              <section className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-4 text-[15px] font-bold text-ink">
                  Thông tin tài khoản
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["Họ và tên", "—"],
                    ["Email", "—"],
                    ["Số điện thoại", "—"],
                    ["Ngày tham gia", "—"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[12.5px] text-muted">{k}</dt>
                      <dd className="text-[14px] font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/dang-nhap"
                  className="mt-5 inline-flex h-10 items-center rounded-xl bg-green px-5 text-sm font-semibold text-white transition hover:bg-green-d"
                >
                  Đăng nhập để xem thông tin
                </Link>
              </section>

              <section className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-4 text-[15px] font-bold text-ink">
                  Đơn hàng gần đây
                </h2>
                <div className="rounded-xl border border-dashed border-line py-10 text-center">
                  <p className="text-[14px] font-medium text-ink">
                    Chưa có đơn hàng nào
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    Các đơn hàng của bạn sẽ hiển thị tại đây.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
