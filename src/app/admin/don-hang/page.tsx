import { CartIcon } from "@/components/icons";
import { getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Đơn hàng" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("vi-VN");
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">
        Quản lý đơn hàng ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green">
            <CartIcon className="h-7 w-7" />
          </span>
          <p className="text-[15px] font-semibold text-ink">Chưa có đơn hàng</p>
          <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted">
            Đơn mua hàng và thu cũ đổi mới của khách sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Loại</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Liên hệ</th>
                <th className="px-4 py-3 font-semibold">Chi tiết</th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                        o.type === "tradein"
                          ? "bg-amber/15 text-[#B8860B]"
                          : "bg-green-soft text-green-d"
                      }`}
                    >
                      {o.type === "tradein" ? "Thu cũ" : "Mua hàng"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{o.name}</div>
                    <div className="text-[12px] text-muted">{o.address}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    <div>{o.phone}</div>
                    {o.email && <div className="text-[12px]">{o.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {o.type === "purchase" ? (
                      <span className="font-semibold text-sale">
                        {o.total != null ? formatPrice(o.total) : "—"}
                      </span>
                    ) : (
                      <div>
                        <div>Máy thu: {o.model}</div>
                        {o.upgradeTo && (
                          <div className="text-[12px]">Lên đời: {o.upgradeTo}</div>
                        )}
                      </div>
                    )}
                    {o.note && (
                      <div className="mt-0.5 text-[12px] text-muted">
                        Ghi chú: {o.note}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[12.5px] text-muted">
                    {fmtDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
