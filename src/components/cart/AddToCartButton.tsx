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
  ariaLabel,
}: {
  item: Omit<CartItem, "qty">;
  qty?: number;
  className?: string;
  children: ReactNode;
  redirectTo?: string;
  onAdded?: () => void;
  /** Nhãn trợ năng khi nút chỉ có icon (không có chữ). */
  ariaLabel?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
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
