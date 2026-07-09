import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <AccountShell
      activeHref="/tai-khoan"
      crumbLabel="Thông tin tài khoản"
      title="Tài khoản của tôi"
    >
      <div className="rounded-lg bg-green-tint px-4 py-3 text-[13px] text-green-d">
        Đây là giao diện tài khoản (demo). Đăng nhập/đăng ký thật sẽ hoạt động khi
        kết nối NextAuth + database.
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
    </AccountShell>
  );
}
