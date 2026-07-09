import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import {
  PRICE_OPTIONS,
  SORT_OPTIONS,
  mergeParams,
  parseQuery,
  queryProducts,
  toggleParam,
  type RawParams,
} from "@/lib/product-query";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";

// Khối duyệt sản phẩm: bộ lọc dạng nút ở trên cùng + lưới sản phẩm full-width.
// Server Component; lọc/sắp xếp/phân trang qua URL (SEO-friendly).

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
        active
          ? "border-green bg-green text-white"
          : "border-line bg-white text-ink-2 hover:border-green hover:text-green-d"
      }`}
    >
      {children}
    </Link>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-14 shrink-0 text-[13px] font-semibold text-ink-2">
        {label}
      </span>
      {children}
    </div>
  );
}

export function ProductBrowser({
  basePath,
  searchParams,
  products,
  brands,
}: {
  basePath: string;
  searchParams: RawParams;
  products: Product[];
  brands: string[];
  /** Giữ để tương thích; các bộ lọc link đã tự giữ mọi param hiện có. */
  preserve?: Record<string, string>;
}) {
  const query = parseQuery(searchParams);
  const { items, total, page, totalPages } = queryProducts(products, query);

  return (
    <div>
      {/* Thanh bộ lọc trên cùng */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
        {brands.length > 1 && (
          <FilterRow label="Hãng">
            <Pill
              href={
                basePath +
                mergeParams(searchParams, { hang: undefined, trang: undefined })
              }
              active={query.brands.length === 0}
            >
              Tất cả
            </Pill>
            {brands.map((brand) => (
              <Pill
                key={brand}
                href={basePath + toggleParam(searchParams, "hang", brand)}
                active={query.brands.includes(brand)}
              >
                {brand}
              </Pill>
            ))}
          </FilterRow>
        )}

        <FilterRow label="Giá">
          <Pill
            href={
              basePath +
              mergeParams(searchParams, { gia: undefined, trang: undefined })
            }
            active={query.prices.length === 0}
          >
            Tất cả
          </Pill>
          {PRICE_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              href={basePath + toggleParam(searchParams, "gia", opt.value)}
              active={query.prices.includes(opt.value)}
            >
              {opt.label}
            </Pill>
          ))}
        </FilterRow>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-[13.5px] text-ink-2">
            <b className="text-ink">{total}</b> sản phẩm
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-muted">Sắp xếp:</span>
            {SORT_OPTIONS.map((opt) => (
              <Pill
                key={opt.value}
                href={
                  basePath +
                  mergeParams(searchParams, {
                    sapxep: opt.value === "moi" ? undefined : opt.value,
                    trang: undefined,
                  })
                }
                active={query.sort === opt.value}
              >
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Lưới sản phẩm (full-width, ra giữa) */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
          <p className="text-[15px] font-semibold text-ink">
            Không tìm thấy sản phẩm phù hợp
          </p>
          <p className="mt-1 text-[13.5px] text-muted">
            Thử bỏ bớt bộ lọc hoặc chọn mức giá khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-3 max-[720px]:grid-cols-2 max-[460px]:gap-2.5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        basePath={basePath}
        searchParams={searchParams}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
