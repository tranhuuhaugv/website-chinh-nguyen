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
import type { ProductAccent } from "@/lib/types";

// State cho tính năng "So sánh sản phẩm". Client Component vì cần tương tác
// (thêm/xoá) và chia sẻ state giữa card, thanh so sánh và bảng so sánh.
// Lưu localStorage để danh sách không mất khi chuyển trang / tải lại.

export const COMPARE_MAX = 4;
const STORAGE_KEY = "compare_items";

export interface CompareItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  accent: ProductAccent;
  /** Ảnh thật (/uploads/...) để giỏ hàng hiện đúng ảnh khi bấm "Mua ngay" từ bảng so sánh. */
  image?: string;
  price: number;
  oldPrice?: number;
  cpu: string;
  ram: string;
  storage: string;
  rating: number;
}

interface CompareContextValue {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  // Nạp từ localStorage khi mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CompareItem[]);
    } catch {
      // bỏ qua dữ liệu hỏng
    }
  }, []);

  // Lưu lại mỗi khi đổi.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // bỏ qua (vd chế độ ẩn danh hết dung lượng)
    }
  }, [items]);

  const add = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id) || prev.length >= COMPARE_MAX) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (id: string) => items.some((p) => p.id === id),
    [items],
  );

  const value = useMemo(
    () => ({ items, add, remove, clear, has }),
    [items, add, remove, clear, has],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare phải dùng bên trong <CompareProvider>");
  }
  return ctx;
}
