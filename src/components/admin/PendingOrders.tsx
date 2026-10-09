"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import {
  ORDER_STATUS_CLS,
  ORDER_STATUS_LABEL,
  isOrderStatus,
  type OrderStatus,
} from "@/lib/order-status";

// Khối "Đơn cần xử lý" ở trang tổng quan: mỗi đơn có nút xử lý ngay tại chỗ.
// Đơn bấm "Hoàn thành" / "Huỷ" sẽ biến mất khỏi danh sách (không hiện nữa).

export interface PendingOrder {
  id: string;
  type: string;
  name: string;
  total: number | null;
  model: string | null;
  status: string;
  /** Chuỗi "12 phút trước" — tính sẵn ở server để khỏi lệch giờ khi hydrate. */
  ago: string;
}

export function PendingOrders({ initial }: { initial: PendingOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function update(o: PendingOrder, status: OrderStatus) {
    if (
      status === "canceled" &&
      !confirm(`Huỷ đơn của "${o.name}"? Đơn sẽ bị ẩn khỏi danh sách cần xử lý.`)
    )
      return;
    setBusyId(o.id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: o.id, status }),
      });
      if (!res.ok) throw new Error("update_failed");
      if (status === "done" || status === "canceled") {
        setOrders((list) => list.filter((x) => x.id !== o.id));
      } else {
        setOrders((list) =>
          list.map((x) => (x.id === o.id ? { ...x, status } : x)),
        );
      }
      router.refresh(); // cập nhật lại câu chào "Có N đơn đang chờ…"
    } catch {
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-tint text-green">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="text-[14px] font-semibold text-ink">
          Đã xử lý hết đơn 🎉
        </p>
        <p className="text-[12.5px] text-muted">
          Đơn mới của khách sẽ hiện ở đây ngay khi được đặt.
        </p>
      </div>
    );
  }

  const act =
    "h-8 rounded-lg px-2.5 text-[12px] font-semibold transition disabled:opacity-50";

  return (
    <ul className="divide-y divide-line">
      {orders.map((o) => {
        const st = isOrderStatus(o.status) ? o.status : "new";
        const busy = busyId === o.id;
        return (
          <li key={o.id} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-tint text-[13px] font-bold text-green-d">
                {o.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <Link
                href="/admin/don-hang"
                className="min-w-0 flex-1 transition hover:opacity-80"
              >
                <p className="truncate text-[13.5px] font-semibold text-ink">
                  {o.name}
                </p>
                <p className="truncate text-[12px] text-muted">
                  {o.type === "tradein"
                    ? `Thu cũ${o.model ? ` · ${o.model}` : ""}`
                    : o.total
                      ? formatPrice(o.total)
                      : "Đơn mua"}{" "}
                  · {o.ago}
                </p>
              </Link>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${ORDER_STATUS_CLS[st]}`}
              >
                {ORDER_STATUS_LABEL[st]}
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap justify-end gap-1.5 pl-12">
              {st === "new" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => update(o, "processing")}
                  className={`${act} border border-line bg-white text-[#1D6FE0] hover:border-[#1D6FE0]`}
                >
                  Nhận xử lý
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => update(o, "done")}
                className={`${act} bg-green text-white hover:bg-green-d`}
              >
                ✓ Hoàn thành
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => update(o, "canceled")}
                className={`${act} border border-line bg-white text-ink-2 hover:border-sale hover:text-sale`}
              >
                Huỷ đơn
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
