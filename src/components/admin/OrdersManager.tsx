"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartIcon, CloseIcon, EyeIcon, TrashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

export interface AdminOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  type: string; // "purchase" | "tradein"
  name: string;
  phone: string;
  email: string | null;
  address: string;
  note: string | null;
  total: number | null;
  model: string | null;
  upgradeTo: string | null;
  items: AdminOrderItem[];
  createdAt: string;
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("vi-VN");
}

export function OrdersManager({ orders: initial }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(o: AdminOrder) {
    if (
      !confirm(
        `Xoá đơn của "${o.name}"? Thao tác không thể hoàn tác.`,
      )
    )
      return;
    setBusyId(o.id);
    try {
      const res = await fetch(`/api/admin/orders?id=${o.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((x) => x.id !== o.id));
        if (viewing?.id === o.id) setViewing(null);
        router.refresh();
      } else {
        alert("Xoá đơn thất bại, vui lòng thử lại.");
      }
    } finally {
      setBusyId(null);
    }
  }

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
          <table className="w-full min-w-[760px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Loại</th>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Liên hệ</th>
                <th className="px-4 py-3 font-semibold">Chi tiết</th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
                <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-bg/60">
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
                    <div className="max-w-[220px] truncate text-[12px] text-muted">
                      {o.address}
                    </div>
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
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[12.5px] text-muted">
                    {fmtDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        aria-label="Xem chi tiết"
                        onClick={() => setViewing(o)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Xoá"
                        disabled={busyId === o.id}
                        onClick={() => remove(o)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <OrderDetailModal
          order={viewing}
          onClose={() => setViewing(null)}
          onDelete={() => remove(viewing)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onDelete,
}: {
  order: AdminOrder;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                order.type === "tradein"
                  ? "bg-amber/15 text-[#B8860B]"
                  : "bg-green-soft text-green-d"
              }`}
            >
              {order.type === "tradein" ? "Thu cũ đổi mới" : "Đơn mua hàng"}
            </span>
            <span className="text-[12.5px] text-muted">
              {fmtDate(order.createdAt)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-bg hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 text-[13.5px]">
          {/* Thông tin khách */}
          <div className="rounded-xl border border-line">
            <div className="border-b border-line bg-bg px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
              Thông tin khách hàng
            </div>
            <dl className="flex flex-col gap-2 px-4 py-3">
              <Field label="Họ tên" value={order.name} />
              <Field label="Điện thoại" value={order.phone} />
              {order.email && <Field label="Email" value={order.email} />}
              <Field label="Địa chỉ" value={order.address} />
              {order.note && <Field label="Ghi chú" value={order.note} />}
            </dl>
          </div>

          {/* Nội dung đơn */}
          {order.type === "purchase" ? (
            <div className="mt-4 rounded-xl border border-line">
              <div className="border-b border-line bg-bg px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
                Sản phẩm
              </div>
              <div className="flex flex-col divide-y divide-line px-4">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-ink">
                      {it.name} <span className="text-muted">× {it.qty}</span>
                    </span>
                    <span className="shrink-0 font-medium text-ink">
                      {formatPrice(it.price * it.qty)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <b className="text-ink">Tổng cộng</b>
                  <b className="text-[15px] text-sale">
                    {order.total != null ? formatPrice(order.total) : "—"}
                  </b>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-line">
              <div className="border-b border-line bg-bg px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
                Máy cần thu
              </div>
              <dl className="flex flex-col gap-2 px-4 py-3">
                <Field label="Mẫu máy" value={order.model ?? "—"} />
                {order.upgradeTo && (
                  <Field label="Muốn lên đời" value={order.upgradeTo} />
                )}
              </dl>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-[13px] font-semibold text-sale transition hover:border-sale hover:bg-sale/5"
          >
            <TrashIcon className="h-4 w-4" />
            Xoá đơn
          </button>
          <a
            href={`tel:${order.phone}`}
            className="rounded-lg bg-green px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-green-d"
          >
            Gọi khách
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
