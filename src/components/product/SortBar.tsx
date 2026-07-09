import Link from "next/link";
import {
  SORT_OPTIONS,
  mergeParams,
  type RawParams,
} from "@/lib/product-query";

// Thanh sắp xếp (link giữ nguyên bộ lọc) + số kết quả. Server Component.

export function SortBar({
  basePath,
  searchParams,
  total,
  sort,
}: {
  basePath: string;
  searchParams: RawParams;
  total: number;
  sort: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[13.5px] text-ink-2">
        <b className="text-ink">{total}</b> sản phẩm
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-muted">Sắp xếp:</span>
        {SORT_OPTIONS.map((opt) => {
          const active = sort === opt.value;
          const href =
            basePath +
            mergeParams(searchParams, {
              sapxep: opt.value === "moi" ? undefined : opt.value,
              trang: undefined,
            });
          return (
            <Link
              key={opt.value}
              href={href}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                active
                  ? "border-green bg-green text-white"
                  : "border-line bg-white text-ink-2 hover:border-green hover:text-green-d"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
