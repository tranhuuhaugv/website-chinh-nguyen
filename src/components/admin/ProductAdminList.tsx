"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

// Quản lý sản phẩm: lọc theo hãng + nhóm theo dòng máy (thay vì show hết 1 bảng).

// Suy ra "dòng máy" từ tên: bỏ tiền tố "Laptop", bỏ tên hãng, lấy các từ đầu
// cho tới khi gặp từ có chữ số (thường là số hiệu). VD "Dell XPS 13..." -> "XPS".
function seriesOf(p: Product): string {
  const name = p.name.replace(/^laptop\s+/i, "").trim();
  const words = name.split(/\s+/);
  if (words[0]?.toLowerCase() === p.brand.toLowerCase()) words.shift();
  const out: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    out.push(w);
    if (out.length >= 2) break;
  }
  return out.join(" ") || "Khác";
}

export function ProductAdminList({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string>("Tất cả");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );

  // Lọc theo hãng + từ khoá + ẩn (demo xoá).
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        !hidden.has(p.id) &&
        (brand === "Tất cả" || p.brand === brand) &&
        (!kw || `${p.name} ${p.brand}`.toLowerCase().includes(kw)),
    );
  }, [products, q, brand, hidden]);

  // Nhóm: hãng -> dòng -> sản phẩm.
  const grouped = useMemo(() => {
    const byBrand = new Map<string, Map<string, Product[]>>();
    for (const p of filtered) {
      if (!byBrand.has(p.brand)) byBrand.set(p.brand, new Map());
      const bySeries = byBrand.get(p.brand)!;
      const s = seriesOf(p);
      if (!bySeries.has(s)) bySeries.set(s, []);
      bySeries.get(s)!.push(p);
    }
    return byBrand;
  }, [filtered]);

  const tabCls = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition ${
      active
        ? "bg-gradient-to-r from-green-d to-green font-semibold text-white shadow-[0_4px_12px_rgba(21,154,72,.28)]"
        : "border border-line bg-white font-medium text-ink-2 hover:border-green hover:text-green-d"
    }`;

  return (
    <div className="flex flex-col gap-4">
      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-ink">
          Quản lý sản phẩm ({filtered.length})
        </h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-9 w-48 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-green"
          />
          <Link
            href="/admin/san-pham/them"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Tab lọc theo hãng */}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button type="button" onClick={() => setBrand("Tất cả")} className={tabCls(brand === "Tất cả")}>
          Tất cả
        </button>
        {brands.map((b) => (
          <button key={b} type="button" onClick={() => setBrand(b)} className={tabCls(brand === b)}>
            {b}
          </button>
        ))}
      </div>

      {/* Danh sách nhóm theo hãng -> dòng */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-muted">
          Không có sản phẩm phù hợp.
        </div>
      ) : (
        Array.from(grouped.entries()).map(([b, bySeries]) => {
          const brandCount = Array.from(bySeries.values()).reduce(
            (n, arr) => n + arr.length,
            0,
          );
          return (
            <section
              key={b}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-line bg-bg px-4 py-3">
                <h2 className="text-[15px] font-bold text-ink">{b}</h2>
                <span className="rounded-full bg-green-soft px-2 py-0.5 text-[12px] font-semibold text-green-d">
                  {brandCount}
                </span>
              </div>

              <div className="flex flex-col">
                {Array.from(bySeries.entries()).map(([series, items]) => (
                  <div key={series} className="border-b border-line last:border-0">
                    <p className="bg-white px-4 pt-3 text-[12px] font-semibold uppercase tracking-wide text-muted">
                      {series} · {items.length}
                    </p>
                    <ul>
                      {items.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-bg/60"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-1 text-[13.5px] font-medium text-ink">
                              {p.name}
                            </span>
                            <span className="text-[12px] text-muted">
                              {p.rating.toFixed(1)} ★ ({p.reviewCount})
                            </span>
                          </span>
                          <span className="shrink-0 text-[13.5px] font-semibold text-sale">
                            {formatPrice(p.price)}
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            <Link
                              href={`/admin/san-pham/${p.id}`}
                              aria-label="Sửa"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              aria-label="Xóa"
                              onClick={() =>
                                setHidden((prev) => new Set(prev).add(p.id))
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
