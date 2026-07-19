"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/components/cart/CartContext";
import { CartIcon, MessengerIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

// Panel mua hàng: số lượng + Mua ngay / Thêm giỏ + kênh chat. Client Component.

export function ProductPurchase({ item }: { item: Omit<CartItem, "qty"> }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-ink-2">Số lượng</span>
        <div className="flex items-center rounded-xl border border-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Giảm"
            className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-green-d"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Tăng"
            className="flex h-9 w-9 items-center justify-center text-ink-2 hover:text-green-d"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {added && (
        <p className="rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
          Đã thêm vào giỏ.{" "}
          <Link href="/gio-hang" className="font-semibold underline">
            Xem giỏ hàng
          </Link>
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            addItem(item, qty);
            router.push("/gio-hang");
          }}
          className="flex h-14 flex-col items-center justify-center rounded-2xl bg-green leading-tight text-white transition hover:bg-green-d"
        >
          <span className="text-[15px] font-bold">Mua ngay</span>
          <span className="text-[11px] font-normal text-white/85">
            Giao nhanh tận nơi
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(item, qty);
            setAdded(true);
          }}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-ink text-[14px] font-semibold text-white transition hover:bg-black"
        >
          <CartIcon className="h-[18px] w-[18px]" />
          Thêm vào giỏ
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://zalo.me/${SITE.hotlineTel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13.5px] font-semibold text-ink-2 transition hover:border-[#0068FF] hover:text-[#0068FF]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0068FF] text-[9px] font-bold text-white">
            Za
          </span>
          Chat Zalo
        </a>
        <a
          href={SITE.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13.5px] font-semibold text-ink-2 transition hover:border-[#0084FF] hover:text-[#0084FF]"
        >
          <MessengerIcon className="h-[18px] w-[18px] text-[#0084FF]" />
          Messenger
        </a>
      </div>
    </div>
  );
}
