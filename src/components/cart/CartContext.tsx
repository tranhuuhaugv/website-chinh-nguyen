"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

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
  }, []);

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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong <CartProvider>");
  return ctx;
}
