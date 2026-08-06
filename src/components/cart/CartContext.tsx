"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { CheckIcon } from "@/components/icons";

// Giỏ hàng lưu ở localStorage -> chạy được ngay khi chưa có backend.
// Khi có DB/đăng nhập: đồng bộ giỏ lên server trong các hàm add/remove/update.

const STORAGE_KEY = "cn_cart_v1";

type NewItem = Omit<CartItem, "qty">;

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: NewItem, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  /** Đã đọc xong localStorage chưa (tránh nhấp nháy khi hydrate). */
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  // Thông báo nhỏ (toast) khi thêm vào giỏ.
  const [toast, setToast] = useState<{ name: string; id: number } | null>(null);
  const toastId = useRef(0);

  // Đọc giỏ từ localStorage sau khi mount (không chạy trên server).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // bỏ qua dữ liệu hỏng
    }
    setReady(true);
  }, []);

  // Ghi lại mỗi khi giỏ đổi (chỉ sau khi đã đọc xong).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // bỏ qua nếu localStorage đầy/không dùng được
    }
  }, [items, ready]);

  const addItem = useCallback((item: NewItem, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: Math.min(99, p.qty + qty) } : p,
        );
      }
      return [...prev, { ...item, qty: Math.min(99, qty) }];
    });
    toastId.current += 1;
    setToast({ name: item.name, id: toastId.current });
  }, []);

  // Tự ẩn toast sau ~2.4s (khớp thời lượng animation).
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    const q = Math.max(1, Math.min(99, qty));
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((s, p) => s + p.qty, 0);
    const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
    return {
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clear,
      ready,
    };
  }, [items, addItem, removeItem, updateQty, clear, ready]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 px-4">
          <div
            key={toast.id}
            className="cart-toast pointer-events-auto flex items-center gap-3 rounded-full border border-line bg-white py-2.5 pl-3 pr-4 shadow-[0_12px_32px_rgba(16,24,20,0.18)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-white">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="text-[13.5px] text-ink">
              Đã thêm{" "}
              <b className="font-semibold">{toast.name}</b> vào giỏ
            </span>
            <Link
              href="/gio-hang"
              className="ml-1 shrink-0 rounded-full bg-green-tint px-3 py-1 text-[12.5px] font-semibold text-green-d transition hover:bg-green-soft"
            >
              Xem giỏ
            </Link>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong <CartProvider>");
  return ctx;
}
