"use client";

import { CompareIcon } from "@/components/icons";
import { useCompare } from "./CompareContext";

/** Nút "So sánh" trong mỗi card — thêm sản phẩm vào thanh so sánh. */
export function CompareButton({ id, name }: { id: string; name: string }) {
  const { add } = useCompare();

  return (
    <button
      type="button"
      onClick={() => add({ id, name })}
      className="mt-2 flex w-full items-center justify-center gap-[5px] text-xs font-medium text-muted transition hover:text-green-d"
    >
      <CompareIcon className="h-[13px] w-[13px]" />
      So sánh
    </button>
  );
}
