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
import Image from "next/image";
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
  const [toast, setToast] = useState<{
    name: string;
    image?: string;
    id: number;
  } | null>(null);
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
          p.id === item.id
            ? {
                ...p,
                image: p.image ?? item.image,
                qty: Math.min(99, p.qty + qty),
              }
            : p,
        );
      }
      return [...prev, { ...item, qty: Math.min(99, qty) }];
    });
    toastId.current += 1;
    setToast({ name: item.name, image: item.image, id: toastId.current });
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
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 max-lg:bottom-[76px] lg:bottom-6">
          <div
            key={toast.id}
            className="cart-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white p-2.5 shadow-[0_16px_40px_rgba(16,24,20,0.22)]"
          >
            {/* Ảnh sản phẩm (nếu có) — không thì badge tích xanh */}
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F5]">
              {toast.image ? (
                <Image
                  src={toast.image}
                  alt=""
                  fill
                  sizes="44px"
                  loading="eager"
                  className="object-contain p-1"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-green text-white">
                  <CheckIcon className="h-5 w-5" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[11.5px] font-semibold text-green-d">
                <CheckIcon className="h-3.5 w-3.5 shrink-0" />
                Đã thêm vào giỏ
              </div>
              <div className="line-clamp-1 text-[13px] font-medium text-ink">
                {toast.name}
              </div>
            </div>

            <Link
              href="/gio-hang"
              className="shrink-0 rounded-xl bg-green px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-green-d"
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
