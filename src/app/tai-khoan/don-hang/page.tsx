import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { CartIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/session";
import { getUserOrders } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "Mới", cls: "bg-green-soft text-green-d" },
  processing: { label: "Đang xử lý", cls: "bg-amber/15 text-[#B8860B]" },
  done: { label: "Hoàn tất", cls: "bg-green text-white" },
  canceled: { label: "Đã hủy", cls: "bg-sale/10 text-sale" },
};

type OrderItem = { name: string; qty: number; price: number };

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("vi-VN");
}

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap");

  const orders = await getUserOrders(user.id);

  return (
    <AccountShell
      activeHref="/tai-khoan/don-hang"
      crumbLabel="Đơn hàng của tôi"
      title="Đơn hàng của tôi"
      userName={user.name ?? undefined}
    >
      {orders.length === 0 ? (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[15px] font-bold text-ink">
            Lịch sử đơn hàng
          </h2>
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
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => {
            const st = STATUS[o.status] ?? STATUS.new;
            const items = Array.isArray(o.items)
              ? (o.items as unknown as OrderItem[])
              : [];
            return (
              <section
                key={o.id}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                        o.type === "tradein"
                          ? "bg-amber/15 text-[#B8860B]"
                          : "bg-green-soft text-green-d"
                      }`}
                    >
                      {o.type === "tradein" ? "Thu cũ đổi mới" : "Mua hàng"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${st.cls}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <span className="text-[12.5px] text-muted">
                    {fmtDate(o.createdAt)}
                  </span>
                </div>

                {o.type === "purchase" ? (
                  <div className="mt-3">
                    <ul className="flex flex-col gap-1.5 text-[13.5px] text-ink-2">
                      {items.map((it, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span>
                            {it.name} × {it.qty}
                          </span>
                          <span className="shrink-0 font-medium text-ink">
                            {formatPrice(it.price * it.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-line pt-3">
                      <b className="text-[14px] text-ink">Tổng cộng</b>
                      <b className="text-[15px] text-sale">
                        {o.total != null ? formatPrice(o.total) : "—"}
                      </b>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-[13.5px] text-ink-2">
                    <p>
                      Máy cần thu: <b className="text-ink">{o.model}</b>
                    </p>
                    {o.upgradeTo && <p className="mt-1">Muốn lên đời: {o.upgradeTo}</p>}
                  </div>
                )}

                <p className="mt-3 text-[12.5px] text-muted">
                  Giao đến: {o.address}
                </p>
              </section>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}
