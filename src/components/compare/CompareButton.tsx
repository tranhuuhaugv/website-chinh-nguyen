"use client";

import { CheckIcon, CompareIcon } from "@/components/icons";
import { useCompare, type CompareItem } from "./CompareContext";

/** Nút "So sánh" trong mỗi card — thêm/bỏ sản phẩm khỏi thanh so sánh. */
export function CompareButton({ product }: { product: CompareItem }) {
  const { add, remove, has } = useCompare();
  const active = has(product.id);

  return (
    <button
      type="button"
      onClick={() => (active ? remove(product.id) : add(product))}
      className={`mt-2 flex w-full items-center justify-center gap-[5px] text-xs font-medium transition ${
        active ? "text-green-d" : "text-muted hover:text-green-d"
      }`}
    >
      {active ? (
        <CheckIcon className="h-[13px] w-[13px]" />
      ) : (
        <CompareIcon className="h-[13px] w-[13px]" />
      )}
      {active ? "Đang so sánh" : "So sánh"}
    </button>
  );
}
