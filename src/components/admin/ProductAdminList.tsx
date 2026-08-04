"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

// Quản lý sản phẩm: đọc DB thật, tìm kiếm + lọc hãng/tình trạng, sửa/xoá thật.

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  condition: string;
  cpu: string;
  ram: string;
  storage: string;
  series: string;
  updatedBy: string;
}

const PER_PAGE = 20;

export function ProductAdminList({
  products,
  seriesList = [],
}: {
  products: AdminProduct[];
  seriesList?: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState(products);
  // Khởi tạo bộ lọc/trang TỪ URL -> mở 1 sản phẩm rồi bấm back sẽ về đúng
  // bộ lọc + trang trước đó (thay vì reset về đầu).
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [brand, setBrand] = useState(() => searchParams.get("brand") ?? "Tất cả");
  const [series, setSeries] = useState(
    () => searchParams.get("series") ?? "Tất cả",
  );
  const [cond, setCond] = useState(() => searchParams.get("cond") ?? "Tất cả");
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [busy, setBusy] = useState<string | null>(null);

  // Ghi bộ lọc/trang hiện tại vào URL (?q&brand&series&cond&page) bằng replace
  // (không tạo lịch sử thừa, không cuộn trang). Nhờ vậy khi mở 1 sản phẩm rồi
  // bấm back, danh sách trở lại đúng bộ lọc + trang + vị trí cuộn trước đó.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (brand !== "Tất cả") sp.set("brand", brand);
    if (series !== "Tất cả") sp.set("series", series);
    if (cond !== "Tất cả") sp.set("cond", cond);
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    if (qs !== searchParams.toString()) {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [q, brand, series, cond, page, pathname, router, searchParams]);

  const brands = useMemo(
    () => Array.from(new Set(rows.map((p) => p.brand))).sort(),
    [rows],
  );

  // Dòng máy của hãng đang chọn (slug bắt đầu bằng slug hãng).
  const brandSeries = useMemo(() => {
    if (brand === "Tất cả") return [];
    const bslug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return seriesList.filter((s) => s.slug.startsWith(`${bslug}-`));
  }, [brand, seriesList]);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return rows.filter(
      (p) =>
        (brand === "Tất cả" || p.brand === brand) &&
        (series === "Tất cả" || p.series === series) &&
        (cond === "Tất cả" ||
          (cond === "Cũ" ? p.condition !== "new" : p.condition === "new")) &&
        (!kw || `${p.name} ${p.brand} ${p.cpu}`.toLowerCase().includes(kw)),
    );
  }, [rows, q, brand, series, cond]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, totalPages);
  const shown = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  async function remove(p: AdminProduct) {
    if (!confirm(`Xoá sản phẩm "${p.name}"? Thao tác không thể hoàn tác.`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/products?id=${p.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRows((prev) => prev.filter((x) => x.id !== p.id));
        router.refresh();
      } else {
        alert("Xoá thất bại, vui lòng thử lại.");
      }
    } finally {
      setBusy(null);
    }
  }

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
      active ? "bg-green text-white" : "bg-bg text-ink-2 hover:bg-green-tint"
    }`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-ink">
            Quản lý sản phẩm ({rows.length})
          </h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Dữ liệu thật từ database — sửa giá / cấu hình / ảnh tại đây.
          </p>
        </div>
        <Link
          href="/admin/san-pham/them"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Tìm kiếm + lọc */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, hãng, CPU..."
          className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-green"
        />
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["Tất cả", ...brands].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBrand(b);
                setSeries("Tất cả"); // đổi hãng -> bỏ lọc dòng máy cũ
                setPage(1);
              }}
              className={chip(brand === b)}
            >
              {b}
            </button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-line" />
          {["Tất cả", "Cũ", "Mới"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCond(c);
                setPage(1);
              }}
              className={chip(cond === c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lọc theo DÒNG MÁY — hiện khi đã chọn 1 hãng có dòng máy */}
        {brandSeries.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-line pt-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[11.5px] font-semibold uppercase tracking-wide text-muted">
              Dòng máy
            </span>
            {["Tất cả", ...brandSeries.map((s) => s.slug)].map((slug) => {
              const label =
                slug === "Tất cả"
                  ? "Tất cả"
                  : (brandSeries.find((s) => s.slug === slug)?.name ?? slug);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => {
                    setSeries(slug);
                    setPage(1);
                  }}
                  className={chip(series === slug)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Tên sản phẩm</th>
              <th className="px-4 py-3 font-semibold">Giá</th>
              <th className="px-4 py-3 font-semibold">Người sửa</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  Không có sản phẩm phù hợp.
                </td>
              </tr>
            ) : (
              shown.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line last:border-0 hover:bg-bg/60"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{p.name}</div>
                    <div className="text-[12px] text-muted">
                      {[p.cpu, p.ram, p.storage].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sale">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-2">
                    {p.updatedBy || <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Xem trang sản phẩm"
                        className="flex h-8 items-center rounded-lg border border-line px-2 text-[12px] text-ink-2 transition hover:border-green hover:text-green-d"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/san-pham/${p.id}`}
                        aria-label="Sửa"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label="Xoá"
                        disabled={busy === p.id}
                        onClick={() => remove(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={cur === 1}
            className="rounded-lg border border-line px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-[13px] text-muted">
            Trang {cur}/{totalPages} · {filtered.length} sản phẩm
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={cur === totalPages}
            className="rounded-lg border border-line px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
