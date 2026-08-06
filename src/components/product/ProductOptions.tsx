"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatPrice } from "@/lib/format";

// Tùy chọn cấu hình + giá của 1 sản phẩm. Bấm 1 option -> đổi GIÁ hiển thị +
// giá thêm vào giỏ (cả bảng giá desktop lẫn thanh mua mobile), qua Context.

export interface ProdOption {
  label: string;
  price: number;
}

interface Ctx {
  options: ProdOption[];
  selected: number | null; // index; null = dùng giá gốc
  setSelected: (i: number) => void;
  price: number; // giá đang chọn (hoặc giá gốc)
  label: string | null; // nhãn option đang chọn
}

const OptionCtx = createContext<Ctx | null>(null);

export function ProductOptionProvider({
  options,
  basePrice,
  children,
}: {
  options: ProdOption[];
  basePrice: number;
  children: ReactNode;
}) {
  // Có option -> mặc định chọn cái đầu (giá đầu = giá hiển thị).
  const [selected, setSelected] = useState<number | null>(
    options.length ? 0 : null,
  );
  const value = useMemo<Ctx>(() => {
    const opt = selected != null ? options[selected] : null;
    return {
      options,
      selected,
      setSelected,
      price: opt ? opt.price : basePrice,
      label: opt ? opt.label : null,
    };
  }, [options, selected, basePrice]);

  return <OptionCtx.Provider value={value}>{children}</OptionCtx.Provider>;
}

export function useProductOption() {
  return useContext(OptionCtx);
}

/** Giá lớn (phản ứng theo option). Không có option -> hiện thêm giá gạch + %. */
export function ProductPrice({
  oldPrice,
  discount,
}: {
  oldPrice?: number;
  discount: number;
}) {
  const ctx = useProductOption();
  const price = ctx?.price ?? oldPrice ?? 0;
  const hasOptions = (ctx?.options.length ?? 0) > 0;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-[28px] font-extrabold text-sale">
          {formatPrice(price)}
        </span>
        {!hasOptions && oldPrice ? (
          <span className="text-[15px] text-muted line-through">
            {formatPrice(oldPrice)}
          </span>
        ) : null}
      </div>
      {!hasOptions && discount > 0 ? (
        <span className="mt-1.5 inline-block rounded-full bg-sale px-2.5 py-0.5 text-[12px] font-bold text-white">
          Giảm {discount}%
        </span>
      ) : null}
    </div>
  );
}

/** Danh sách nút chọn cấu hình. Không có option -> không hiện gì. */
export function ProductOptionPicker() {
  const ctx = useProductOption();
  if (!ctx || ctx.options.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-[13px] font-semibold text-ink">
        Chọn cấu hình
      </p>
      <div className="flex flex-wrap gap-2">
        {ctx.options.map((o, i) => {
          const active = ctx.selected === i;
          return (
            <button
              key={`${o.label}-${i}`}
              type="button"
              onClick={() => ctx.setSelected(i)}
              className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left transition ${
                active
                  ? "border-green bg-green-tint ring-1 ring-green"
                  : "border-line bg-white hover:border-green/60"
              }`}
            >
              <span className="text-[13px] font-semibold text-ink">
                {o.label}
              </span>
              <span
                className={`text-[13px] font-bold ${active ? "text-green-d" : "text-sale"}`}
              >
                {formatPrice(o.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
