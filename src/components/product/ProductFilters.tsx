import Link from "next/link";
import { PRICE_OPTIONS } from "@/lib/product-query";

// Bộ lọc dạng form GET (server, không cần JS): chọn hãng + khoảng giá rồi "Áp dụng".
// Các param cần giữ lại (sắp xếp, từ khoá) truyền qua `preserve` -> input ẩn.

export function ProductFilters({
  basePath,
  brands,
  selectedBrands,
  selectedPrices,
  preserve = {},
}: {
  basePath: string;
  brands: string[];
  selectedBrands: string[];
  selectedPrices: string[];
  preserve?: Record<string, string>;
}) {
  return (
    <form
      method="get"
      action={basePath}
      className="rounded-2xl border border-line bg-white p-4"
    >
      {Object.entries(preserve).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">Bộ lọc</h2>
        <Link href={basePath} className="text-[12.5px] text-muted hover:text-green-d">
          Xóa lọc
        </Link>
      </div>

      {brands.length > 1 && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-[13px] font-semibold text-ink-2">
            Thương hiệu
          </legend>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2 text-[13.5px] text-ink"
              >
                <input
                  type="checkbox"
                  name="hang"
                  value={brand}
                  defaultChecked={selectedBrands.includes(brand)}
                  className="h-4 w-4 accent-green"
                />
                {brand}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-4">
        <legend className="mb-2 text-[13px] font-semibold text-ink-2">
          Mức giá
        </legend>
        <div className="flex flex-col gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13.5px] text-ink"
            >
              <input
                type="checkbox"
                name="gia"
                value={opt.value}
                defaultChecked={selectedPrices.includes(opt.value)}
                className="h-4 w-4 accent-green"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-5 h-10 w-full rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
      >
        Áp dụng
      </button>
    </form>
  );
}
