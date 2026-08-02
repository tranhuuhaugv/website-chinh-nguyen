"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartIcon,
  CloseIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons";
import { ProductImage } from "@/components/ProductImage";
import type { ProductAccent } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export interface AdminOrderItem {
  name: string;
  qty: number;
  price: number;
  slug?: string;
  image?: string;
}

// Chọn màu art ổn định theo slug/tên (khi sản phẩm chưa có ảnh thật).
const ACCENTS: ProductAccent[] = ["blue", "red", "silver", "crimson", "dark"];
function pickAccent(key: string): ProductAccent {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

// Ô ảnh sản phẩm (ảnh thật nếu có, không thì art) — bấm sang trang sản phẩm.
function ItemThumb({ item }: { item: AdminOrderItem }) {
  const key = item.slug ?? item.name;
  const inner = item.image ? (
    <Image
      src={item.image}
      alt={item.name}
      width={56}
      height={56}
      className="h-full w-full object-cover"
    />
  ) : (
    <ProductImage accent={pickAccent(key)} uid={`ord-${key}`} />
  );
  const box = (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-[#F5F7F5]">
      {inner}
    </div>
  );
  return item.slug ? (
    <Link
      href={`/${item.slug}`}
      target="_blank"
      rel="noreferrer"
      title="Xem trang sản phẩm"
      className="shrink-0 transition hover:opacity-80"
    >
      {box}
    </Link>
  ) : (
    box
  );
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
  const isTradein = order.type === "tradein";
  const shortId = order.id.slice(-6).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="relative bg-gradient-to-r from-green-d to-green px-5 py-4 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11.5px] font-semibold">
              {isTradein ? "Thu cũ đổi mới" : "Đơn mua hàng"}
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium">
              #{shortId}
            </span>
          </div>
          <div className="mt-2 text-[12.5px] text-white/85">
            Đặt lúc {fmtDate(order.createdAt)}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-bg/40 p-5 text-[13.5px]">
          {/* Thông tin khách */}
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="border-b border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-muted">
              Thông tin khách hàng
            </div>
            <div className="flex flex-col gap-2.5 px-4 py-3.5">
              <InfoRow icon={<UserIcon className="h-4 w-4" />} value={order.name} />
              <InfoRow
                icon={<PhoneIcon className="h-4 w-4" />}
                value={
                  <a href={`tel:${order.phone}`} className="text-green-d hover:underline">
                    {order.phone}
                  </a>
                }
              />
              {order.email && (
                <InfoRow
                  icon={<span className="text-[13px]">@</span>}
                  value={
                    <a href={`mailto:${order.email}`} className="text-green-d hover:underline">
                      {order.email}
                    </a>
                  }
                />
              )}
              <InfoRow
                icon={<MapPinIcon className="h-4 w-4" />}
                value={order.address}
              />
              {order.note && (
                <div className="mt-1 rounded-lg bg-amber/10 px-3 py-2 text-[12.5px] text-[#8a6d0b]">
                  <b>Ghi chú:</b> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Nội dung đơn */}
          {order.type === "purchase" ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
              <div className="border-b border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-muted">
                Sản phẩm ({order.items.length})
              </div>
              <div className="flex flex-col divide-y divide-line">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <ItemThumb item={it} />
                    <div className="min-w-0 flex-1">
                      {it.slug ? (
                        <Link
                          href={`/${it.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="line-clamp-2 font-semibold text-ink transition hover:text-green-d"
                        >
                          {it.name}
                        </Link>
                      ) : (
                        <span className="line-clamp-2 font-semibold text-ink">
                          {it.name}
                        </span>
                      )}
                      <div className="mt-0.5 text-[12.5px] text-muted">
                        {formatPrice(it.price)} × {it.qty}
                      </div>
                    </div>
                    <span className="shrink-0 text-[13.5px] font-bold text-ink">
                      {formatPrice(it.price * it.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t-2 border-line bg-green-soft/40 px-4 py-3">
                <b className="text-[14px] text-ink">Tổng cộng</b>
                <b className="text-[18px] text-sale">
                  {order.total != null ? formatPrice(order.total) : "—"}
                </b>
              </div>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
              <div className="border-b border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-muted">
                Máy cần thu
              </div>
              <div className="flex flex-col gap-2.5 px-4 py-3.5">
                <InfoRow
                  icon={<CartIcon className="h-4 w-4" />}
                  value={<b className="text-ink">{order.model ?? "—"}</b>}
                />
                {order.upgradeTo && (
                  <InfoRow
                    icon={<span className="text-[13px]">↑</span>}
                    value={<>Muốn lên đời: {order.upgradeTo}</>}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line bg-white px-5 py-3">
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
            className="flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-green-d"
          >
            <PhoneIcon className="h-4 w-4" />
            Gọi khách
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  value,
}: {
  icon: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-muted">
        {icon}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
