"use client";

import { useEffect } from "react";
import Link from "next/link";

// Pop-up báo sản phẩm chưa mua được (hết hàng / sắp về), dẫn khách sang xem sản phẩm khác.
// Bấm nền, nút Đóng hoặc Esc để tắt.

export function StockNoticeModal({
  open,
  onClose,
  productName,
  label = "Hết hàng",
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  /** "Hết hàng" | "Sắp về hàng" — quyết định lời thông báo. */
  label?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const soon = label !== "Hết hàng";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-notice-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-2xl bg-white p-6 text-center shadow-pop"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3DC] text-[28px]">
          📦
        </div>
        <h2
          id="stock-notice-title"
          className="mt-3 text-[18px] font-bold text-ink"
        >
          {soon ? "Sản phẩm sắp về hàng" : "Sản phẩm đã hết hàng"}
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          Rất tiếc, <b className="text-ink">{productName}</b>{" "}
          {soon ? "hiện chưa có hàng." : "hiện đã hết hàng."} Bạn xem thêm các mẫu
          laptop khác đang có sẵn nhé!
        </p>

        <Link
          href="/san-pham"
          onClick={onClose}
          className="mt-5 flex h-11 items-center justify-center rounded-xl bg-green text-[14px] font-bold text-white transition hover:bg-green-d"
        >
          Xem sản phẩm khác
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="mt-2.5 w-full py-2 text-[13px] font-medium text-muted transition hover:text-ink"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
