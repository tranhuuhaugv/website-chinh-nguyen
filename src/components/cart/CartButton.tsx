"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { useCart } from "./CartContext";

// Nút giỏ hàng ở header với số lượng cập nhật theo giỏ. Client Component.

export function CartButton() {
  const { totalItems, ready } = useCart();

  return (
    <Link
      href="/gio-hang"
      className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink transition hover:bg-bg"
    >
      <CartIcon className="h-5 w-5" />
      <span className="max-[900px]:hidden">Giỏ hàng</span>
      {ready && totalItems > 0 && (
        <span className="absolute left-6 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-[#3a2600]">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
