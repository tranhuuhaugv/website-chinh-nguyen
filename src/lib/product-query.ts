import type { Product } from "./types";

// Lọc + sắp xếp + phân trang cho các trang danh sách (danh mục, tìm kiếm).
// Chạy phía server dựa trên URL searchParams -> thân thiện SEO, không cần JS.

export const PER_PAGE = 12;

export const PRICE_OPTIONS: { value: string; label: string }[] = [
  { value: "duoi-15", label: "Dưới 15 triệu" },
  { value: "15-25", label: "15 – 25 triệu" },
  { value: "25-35", label: "25 – 35 triệu" },
  { value: "tren-35", label: "Trên 35 triệu" },
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "moi", label: "Mới nhất" },
  { value: "ban-chay", label: "Bán chạy" },
  { value: "gia-tang", label: "Giá thấp → cao" },
  { value: "gia-giam", label: "Giá cao → thấp" },
];

const PRICE_MATCHERS: Record<string, (price: number) => boolean> = {
  "duoi-15": (p) => p < 15_000_000,
  "15-25": (p) => p >= 15_000_000 && p < 25_000_000,
  "25-35": (p) => p >= 25_000_000 && p < 35_000_000,
  "tren-35": (p) => p >= 35_000_000,
};

export interface ProductQuery {
  brands: string[];
  prices: string[];
  sort: string;
  page: number;
}

export interface QueryResult {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export function queryProducts(all: Product[], q: ProductQuery): QueryResult {
  let list = all;

  if (q.brands.length) {
    list = list.filter((p) => q.brands.includes(p.brand));
  }
  if (q.prices.length) {
    list = list.filter((p) =>
      q.prices.some((bucket) => PRICE_MATCHERS[bucket]?.(p.price)),
    );
  }

  switch (q.sort) {
    case "gia-tang":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "gia-giam":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "ban-chay":
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break; // "moi": giữ nguyên thứ tự nguồn
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, q.page), totalPages);
  const items = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return { items, total, page, totalPages };
}

export type RawParams = Record<string, string | string[] | undefined>;

/** Chuẩn hoá 1 giá trị searchParam về mảng. */
export function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** Đọc ProductQuery từ searchParams thô. */
export function parseQuery(sp: RawParams): ProductQuery {
  return {
    brands: toArray(sp.hang),
    prices: toArray(sp.gia),
    sort: typeof sp.sapxep === "string" ? sp.sapxep : "moi",
    page: Number(sp.trang) > 0 ? Number(sp.trang) : 1,
  };
}

/**
 * Bật/tắt 1 giá trị trong param dạng nhiều lựa chọn (VD hãng, giá) rồi trả về
 * query string mới (đồng thời reset về trang 1). Dùng cho nút lọc kiểu toggle.
 */
export function toggleParam(
  current: RawParams,
  key: string,
  value: string,
): string {
  const existing = toArray(current[key]);
  const next = existing.includes(value)
    ? existing.filter((v) => v !== value)
    : [...existing, value];

  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (k === key || k === "trang") continue; // xử lý riêng + reset trang
    if (v == null) continue;
    for (const val of Array.isArray(v) ? v : [v]) sp.append(k, val);
  }
  for (const val of next) sp.append(key, val);

  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * Ghép query string từ params hiện tại + ghi đè. Value undefined/"" -> bỏ.
 * Dùng để tạo link sắp xếp / phân trang mà vẫn giữ các bộ lọc khác.
 */
export function mergeParams(
  current: RawParams,
  overrides: Record<string, string | number | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v == null) continue;
    for (const val of Array.isArray(v) ? v : [v]) sp.append(k, val);
  }
  for (const [k, v] of Object.entries(overrides)) {
    sp.delete(k);
    if (v != null && v !== "") sp.append(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
