import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import {
  NEED_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  mergeParams,
  parseQuery,
  queryProducts,
  setParam,
  type RawParams,
} from "@/lib/product-query";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";

// Khối duyệt sản phẩm: bộ lọc dạng nút ở trên cùng + lưới sản phẩm full-width.
// Server Component; lọc/sắp xếp/phân trang qua URL (SEO-friendly).

// Chip lọc hiện đại: chọn = xanh đặc; chưa chọn = nền dịu, hover xanh nhạt.
function Chip({
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
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
        active
          ? "bg-green text-white shadow-[0_2px_8px_rgba(21,154,72,.28)]"
          : "bg-bg text-ink-2 hover:bg-green-tint hover:text-green-d"
      }`}
    >
      {children}
    </Link>
  );
}

// 1 hàng lọc: nhãn nhỏ in hoa + dải chip cuộn ngang.
function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="w-16 shrink-0 text-[11.5px] font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
      <div className="flex flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
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

  // Hãng / Giá / Nhu cầu: CHỌN 1. Bấm lại mục đang chọn -> bỏ (về "Tất cả").
  const activeBrand = query.brands[0];
  const activePrice = query.prices[0];
  const activeNeed = query.needs[0];

  return (
    <div>
      {/* Thanh bộ lọc trên cùng */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="flex flex-col divide-y divide-line">
          {brands.length > 1 && (
            <FilterRow label="Hãng">
              <Chip
                href={basePath + setParam(searchParams, "hang", undefined)}
                active={!activeBrand}
              >
                Tất cả
              </Chip>
              {brands.map((brand) => (
                <Chip
                  key={brand}
                  href={
                    basePath +
                    setParam(
                      searchParams,
                      "hang",
                      activeBrand === brand ? undefined : brand,
                    )
                  }
                  active={activeBrand === brand}
                >
                  {brand}
                </Chip>
              ))}
            </FilterRow>
          )}

          <FilterRow label="Nhu cầu">
            <Chip
              href={basePath + setParam(searchParams, "nhucau", undefined)}
              active={!activeNeed}
            >
              Tất cả
            </Chip>
            {NEED_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                href={
                  basePath +
                  setParam(
                    searchParams,
                    "nhucau",
                    activeNeed === opt.value ? undefined : opt.value,
                  )
                }
                active={activeNeed === opt.value}
              >
                {opt.label}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Giá">
            <Chip
              href={basePath + setParam(searchParams, "gia", undefined)}
              active={!activePrice}
            >
              Tất cả
            </Chip>
            {PRICE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                href={
                  basePath +
                  setParam(
                    searchParams,
                    "gia",
                    activePrice === opt.value ? undefined : opt.value,
                  )
                }
                active={activePrice === opt.value}
              >
                {opt.label}
              </Chip>
            ))}
          </FilterRow>
        </div>

        {/* Chân: số lượng + sắp xếp */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg/50 px-4 py-2.5">
          <p className="text-[13px] text-ink-2">
            <b className="text-ink">{total}</b> sản phẩm
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[12.5px] text-muted">Sắp xếp:</span>
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={
                  basePath +
                  mergeParams(searchParams, {
                    sapxep: opt.value === "moi" ? undefined : opt.value,
                    trang: undefined,
                  })
                }
                className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition ${
                  query.sort === opt.value
                    ? "bg-green-tint text-green-d"
                    : "text-ink-2 hover:bg-bg"
                }`}
              >
                {opt.label}
              </Link>
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
