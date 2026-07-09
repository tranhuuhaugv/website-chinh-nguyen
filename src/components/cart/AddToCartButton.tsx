"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/types";
import { useCart } from "./CartContext";

// Nút thêm vào giỏ dùng chung (card sản phẩm, trang chi tiết...).
// redirectTo: điều hướng sau khi thêm (VD "/gio-hang" cho nút "Mua ngay").

export function AddToCartButton({
  item,
  qty = 1,
  className,
  children,
  redirectTo,
  onAdded,
}: {
  item: Omit<CartItem, "qty">;
  qty?: number;
  className?: string;
  children: ReactNode;
  redirectTo?: string;
  onAdded?: () => void;
}) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem(item, qty);
        onAdded?.();
        if (redirectTo) router.push(redirectTo);
      }}
    >
      {children}
    </button>
  );
}
