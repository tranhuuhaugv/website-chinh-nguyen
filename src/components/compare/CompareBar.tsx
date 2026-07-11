"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { ProductImage } from "@/components/ProductImage";
import { CloseIcon } from "@/components/icons";
import { COMPARE_MAX, useCompare } from "./CompareContext";
import { CompareModal } from "./CompareModal";

/** Thanh so sánh cố định đáy màn hình, hiện khi có ít nhất 1 sản phẩm. */
export function CompareBar() {
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);
  const show = items.length > 0;
  const canCompare = items.length >= 2;

  return (
    <>
      {open && canCompare && <CompareModal onClose={() => setOpen(false)} />}

      <div
        className={`fixed inset-x-0 bottom-0 z-[55] border-t-2 border-green bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Container className="flex h-[74px] items-center gap-3.5">
          <span className="text-sm font-semibold max-[560px]:hidden">
            So sánh sản phẩm
          </span>
          <div className="flex flex-1 gap-2.5 overflow-x-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex h-12 w-[132px] shrink-0 items-center gap-2 rounded-lg border border-green bg-green-tint pl-1.5 pr-5"
              >
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                  <ProductImage accent={item.accent} uid={`bar-${item.id}`} />
                </div>
                <span className="line-clamp-2 text-[11px] font-medium leading-tight text-green-d">
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Bỏ khỏi so sánh"
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-green-d/60 transition hover:text-sale"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            {items.length < COMPARE_MAX && (
              <div className="hidden h-12 w-[132px] shrink-0 items-center justify-center rounded-lg border border-dashed border-line px-1.5 text-center text-xs text-muted sm:flex">
                Thêm sản phẩm
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!canCompare}
            title={canCompare ? "" : "Chọn ít nhất 2 sản phẩm để so sánh"}
            className="rounded-lg bg-green px-[22px] py-[11px] text-sm font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-50"
          >
            So sánh ngay
          </button>
          <button
            type="button"
            onClick={clear}
            className="cursor-pointer text-[13px] text-muted transition hover:text-ink max-[560px]:hidden"
          >
            Xóa tất cả
          </button>
        </Container>
      </div>
    </>
  );
}
