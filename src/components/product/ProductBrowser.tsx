import type { Product } from "@/lib/types";
import {
  parseQuery,
  queryProducts,
  type RawParams,
} from "@/lib/product-query";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { ProductFilters } from "./ProductFilters";
import { SortBar } from "./SortBar";

// Khối duyệt sản phẩm dùng chung cho trang danh mục & tìm kiếm:
// sidebar lọc + thanh sắp xếp + lưới + phân trang. Server Component.

export function ProductBrowser({
  basePath,
  searchParams,
  products,
  brands,
  preserve = {},
}: {
  basePath: string;
  searchParams: RawParams;
  products: Product[];
  /** Danh sách hãng để lọc (thường là các hãng có trong `products`). */
  brands: string[];
  preserve?: Record<string, string>;
}) {
  const query = parseQuery(searchParams);
  const { items, total, page, totalPages } = queryProducts(products, query);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside>
        <ProductFilters
          basePath={basePath}
          brands={brands}
          selectedBrands={query.brands}
          selectedPrices={query.prices}
          preserve={{
            ...preserve,
            ...(query.sort !== "moi" ? { sapxep: query.sort } : {}),
          }}
        />
      </aside>

      <div>
        <SortBar
          basePath={basePath}
          searchParams={searchParams}
          total={total}
          sort={query.sort}
        />

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
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[460px]:gap-2.5 max-[520px]:grid-cols-2">
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
    </div>
  );
}
