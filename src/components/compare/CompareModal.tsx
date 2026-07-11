"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CartIcon, CloseIcon, StarIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { useCompare, type CompareItem } from "./CompareContext";

// Bảng so sánh các sản phẩm đã chọn (mở từ thanh so sánh).

const ROWS: { label: string; get: (p: CompareItem) => string }[] = [
  { label: "CPU", get: (p) => p.cpu },
  { label: "RAM", get: (p) => p.ram },
  { label: "Ổ cứng", get: (p) => p.storage },
  { label: "Thương hiệu", get: (p) => p.brand },
];

export function CompareModal({ onClose }: { onClose: () => void }) {
  const { items, remove } = useCompare();

  // Đóng bằng phím Esc + khoá cuộn nền.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Giá thấp nhất để tô nổi bật.
  const minPrice = Math.min(...items.map((i) => i.price));

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiêu đề */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-[16px] font-bold text-ink">
            So sánh sản phẩm ({items.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-bg hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Bảng */}
        <div className="overflow-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-[1] w-28 bg-white p-3" />
                {items.map((p) => (
                  <th
                    key={p.id}
                    className="min-w-[150px] border-l border-line p-3 align-top"
                  >
                    <div className="mb-2 h-24 overflow-hidden rounded-xl bg-[#F5F7F5] p-2">
                      <div className="h-full w-full overflow-hidden rounded-lg">
                        <ProductImage accent={p.accent} uid={`cmp-${p.id}`} />
                      </div>
                    </div>
                    <Link
                      href={`/san-pham/${p.slug}`}
                      className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-green-d"
                    >
                      {p.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="mt-1.5 text-[11.5px] font-medium text-muted transition hover:text-sale"
                    >
                      Bỏ khỏi so sánh
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {/* Giá */}
              <tr className="border-t border-line">
                <td className="sticky left-0 z-[1] bg-white p-3 font-medium text-muted">
                  Giá
                </td>
                {items.map((p) => (
                  <td key={p.id} className="border-l border-line p-3 align-top">
                    <span
                      className={`font-bold ${
                        p.price === minPrice ? "text-green-d" : "text-sale"
                      }`}
                    >
                      {formatPrice(p.price)}
                    </span>
                    {p.oldPrice ? (
                      <span className="block text-[11.5px] text-muted line-through">
                        {formatPrice(p.oldPrice)}
                      </span>
                    ) : null}
                    {p.price === minPrice && items.length > 1 && (
                      <span className="mt-1 inline-block rounded bg-green-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-green-d">
                        Giá tốt nhất
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Đánh giá */}
              <tr className="border-t border-line">
                <td className="sticky left-0 z-[1] bg-white p-3 font-medium text-muted">
                  Đánh giá
                </td>
                {items.map((p) => (
                  <td
                    key={p.id}
                    className="border-l border-line p-3 align-top"
                  >
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      <StarIcon className="h-3.5 w-3.5 text-amber" />
                      {p.rating.toFixed(1)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Các thông số */}
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <td className="sticky left-0 z-[1] bg-white p-3 font-medium text-muted">
                    {row.label}
                  </td>
                  {items.map((p) => (
                    <td
                      key={p.id}
                      className="border-l border-line p-3 align-top text-ink-2"
                    >
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Hành động */}
              <tr className="border-t border-line">
                <td className="sticky left-0 z-[1] bg-white p-3" />
                {items.map((p) => (
                  <td key={p.id} className="border-l border-line p-3 align-top">
                    <AddToCartButton
                      item={{
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        price: p.price,
                        accent: p.accent,
                      }}
                      redirectTo="/gio-hang"
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green py-2 text-[12.5px] font-semibold text-white transition hover:bg-green-d"
                    >
                      <CartIcon className="h-3.5 w-3.5" />
                      Mua ngay
                    </AddToCartButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
