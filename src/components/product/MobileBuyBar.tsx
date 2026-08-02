"use client";

import type { CartItem } from "@/lib/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CartIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

// Thanh "Mua ngay" dính đáy — CHỈ mobile, trang chi tiết sản phẩm.
// Thế chỗ thanh điều hướng đáy (đã ẩn ở trang chi tiết) để đẩy chốt đơn.

export function MobileBuyBar({
  item,
  price,
  oldPrice,
}: {
  item: Omit<CartItem, "qty">;
  price: number;
  oldPrice?: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 leading-tight">
          <div className="text-[16px] font-extrabold text-sale">
            {formatPrice(price)}
          </div>
          {oldPrice ? (
            <div className="text-[11px] text-muted line-through">
              {formatPrice(oldPrice)}
            </div>
          ) : null}
        </div>
        <AddToCartButton
          item={item}
          redirectTo="/gio-hang"
          className="ml-auto flex max-w-[230px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-d to-green py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(11,94,44,.28)]"
        >
          <CartIcon className="h-4 w-4" />
          Mua ngay
        </AddToCartButton>
      </div>
    </div>
  );
}
