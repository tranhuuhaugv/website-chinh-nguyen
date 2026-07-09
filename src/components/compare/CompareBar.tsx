"use client";

import { Container } from "@/components/Container";
import { COMPARE_MAX, useCompare } from "./CompareContext";

/** Thanh so sánh cố định đáy màn hình, hiện khi có ít nhất 1 sản phẩm. */
export function CompareBar() {
  const { items, remove, clear } = useCompare();
  const show = items.length > 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[55] border-t-2 border-green bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Container className="flex h-[74px] items-center gap-3.5">
        <span className="text-sm font-semibold">So sánh sản phẩm</span>
        <div className="flex flex-1 gap-2.5 overflow-x-auto">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => remove(item.id)}
              title="Bấm để bỏ khỏi danh sách"
              className="flex h-12 w-[120px] shrink-0 items-center justify-center rounded-lg border border-green bg-green-tint px-1.5 text-center text-xs font-medium text-green-d"
            >
              {item.name}
            </button>
          ))}
          {items.length < COMPARE_MAX && (
            <div className="hidden h-12 w-[120px] shrink-0 items-center justify-center rounded-lg border border-dashed border-line px-1.5 text-center text-xs text-muted sm:flex">
              Thêm sản phẩm
            </div>
          )}
        </div>
        <button
          type="button"
          className="rounded-lg bg-green px-[22px] py-[11px] text-sm font-semibold text-white transition hover:bg-green-d"
        >
          So sánh ngay
        </button>
        <button
          type="button"
          onClick={clear}
          className="cursor-pointer text-[13px] text-muted hover:text-ink"
        >
          Xóa tất cả
        </button>
      </Container>
    </div>
  );
}
