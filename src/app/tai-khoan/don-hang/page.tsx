import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { CartIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  robots: { index: false, follow: false },
};

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap");

  return (
    <AccountShell
      activeHref="/tai-khoan/don-hang"
      crumbLabel="Đơn hàng của tôi"
      title="Đơn hàng của tôi"
      userName={user.name ?? undefined}
    >
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-4 text-[15px] font-bold text-ink">Lịch sử đơn hàng</h2>
        <div className="rounded-xl border border-dashed border-line py-14 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-green">
            <CartIcon className="h-6 w-6" />
          </span>
          <p className="text-[14px] font-medium text-ink">
            Bạn chưa có đơn hàng nào
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Các đơn hàng của bạn sẽ hiển thị tại đây sau khi đặt hàng.
          </p>
          <Link
            href="/san-pham"
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-green px-5 text-sm font-semibold text-white transition hover:bg-green-d"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>
    </AccountShell>
  );
}
