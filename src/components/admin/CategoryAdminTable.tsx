"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CategoryIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import type { Category } from "@/lib/types";

// Quản lý danh mục dạng CÂY: danh mục lớn (hãng / nhóm) -> dòng máy con.
// Con nhận diện qua group="dong-may" + slug bắt đầu bằng slug cha. Có số SP,
// nút mở/đóng, và "+" để thêm danh mục lớn hoặc thêm dòng máy con.

function Count({ n }: { n: number }) {
  return (
    <span
      className={`text-[12.5px] font-bold tabular-nums ${n > 0 ? "text-sale" : "text-muted"}`}
    >
      ({n})
    </span>
  );
}

function RowActions({
  cat,
  busy,
  onDelete,
}: {
  cat: Category;
  busy: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/admin/danh-muc/${cat.slug}`}
        aria-label="Sửa"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
      >
        <EditIcon className="h-4 w-4" />
      </Link>
      <button
        type="button"
        aria-label="Xoá"
        disabled={busy}
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CategoryAdminTable({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [list, setList] = useState(categories);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [allOpen, setAllOpen] = useState(true);

  // Dựng cây: cha = group != dong-may; con = dong-may gắn vào cha có slug là
  // tiền tố dài nhất khớp. Con không khớp cha nào -> "chưa gán".
  const { parents, childrenOf, orphans } = useMemo(() => {
    const parents = list.filter((c) => c.group !== "dong-may");
    const series = list.filter((c) => c.group === "dong-may");
    const childrenOf: Record<string, Category[]> = {};
    const orphans: Category[] = [];
    for (const s of series) {
      let best: Category | null = null;
      for (const p of parents) {
        if (s.slug.startsWith(`${p.slug}-`)) {
          if (!best || p.slug.length > best.slug.length) best = p;
        }
      }
      if (best) (childrenOf[best.slug] ??= []).push(s);
      else orphans.push(s);
    }
    return { parents, childrenOf, orphans };
  }, [list]);

  function isOpen(slug: string) {
    return open[slug] ?? allOpen;
  }
  function toggle(slug: string) {
    setOpen((prev) => ({ ...prev, [slug]: !isOpen(slug) }));
  }
  function setAll(v: boolean) {
    setAllOpen(v);
    setOpen({});
  }

  async function remove(c: Category, hasChildren: boolean) {
    const warn = hasChildren
      ? `Xoá danh mục lớn "${c.name}"? (Các dòng máy con KHÔNG bị xoá, sẽ về mục "chưa gán".)`
      : `Xoá danh mục "${c.name}"?`;
    if (!confirm(warn)) return;
    setBusy(c.slug);
    try {
      const res = await fetch(
        `/api/admin/categories?slug=${encodeURIComponent(c.slug)}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setList((prev) => prev.filter((x) => x.slug !== c.slug));
        router.refresh();
      } else {
        alert("Xoá thất bại.");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div>
          <h1 className="text-[17px] font-bold text-ink">Quản lý danh mục</h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Cây phân cấp: danh mục lớn (hãng / nhóm) → dòng máy con. Số trong
            ngoặc là số sản phẩm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(!allOpen)}
            className="flex h-9 items-center rounded-lg border border-line px-3 text-[13px] font-medium text-ink-2 transition hover:border-green hover:text-green-d"
          >
            {allOpen ? "Thu gọn tất cả" : "Mở tất cả"}
          </button>
          <Link
            href="/admin/danh-muc/them"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm danh mục lớn
          </Link>
        </div>
      </div>

      <div className="p-2 sm:p-3">
        <ul className="flex flex-col">
          {parents.map((p) => {
            const kids = childrenOf[p.slug] ?? [];
            const hasKids = kids.length > 0;
            const opened = isOpen(p.slug);
            return (
              <li key={p.slug}>
                {/* Hàng danh mục lớn */}
                <div className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg">
                  <button
                    type="button"
                    onClick={() => hasKids && toggle(p.slug)}
                    aria-label={opened ? "Thu gọn" : "Mở"}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-2 ${
                      hasKids ? "hover:bg-line" : "invisible"
                    }`}
                  >
                    {opened ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green-soft text-green-d">
                    <CategoryIcon name={p.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <b className="truncate text-[14px] text-ink">{p.name}</b>
                    <Count n={counts[p.slug] ?? 0} />
                    {hasKids && (
                      <span className="text-[11.5px] text-muted">
                        · {kids.length} dòng
                      </span>
                    )}
                  </span>
                  <Link
                    href={`/admin/danh-muc/them?parent=${encodeURIComponent(p.slug)}&brand=${encodeURIComponent(p.name)}&icon=${encodeURIComponent(p.icon)}`}
                    className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-green/50 px-2.5 text-[12.5px] font-semibold text-green-d transition hover:bg-green-tint"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Dòng máy
                  </Link>
                  <RowActions
                    cat={p}
                    busy={busy === p.slug}
                    onDelete={() => remove(p, hasKids)}
                  />
                </div>

                {/* Dòng máy con */}
                {opened && hasKids && (
                  <ul className="mb-1 ml-[30px] flex flex-col border-l border-line pl-2">
                    {kids.map((k) => (
                      <li
                        key={k.slug}
                        className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-bg"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                        <span className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="truncate text-[13.5px] text-ink-2">
                            {k.name}
                          </span>
                          <Count n={counts[k.slug] ?? 0} />
                        </span>
                        <RowActions
                          cat={k}
                          busy={busy === k.slug}
                          onDelete={() => remove(k, false)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          {/* Dòng máy chưa gán hãng */}
          {orphans.length > 0 && (
            <li className="mt-2 border-t border-line pt-2">
              <p className="px-2 py-1 text-[12.5px] font-semibold text-muted">
                Dòng máy chưa gán hãng ({orphans.length})
              </p>
              <ul className="flex flex-col">
                {orphans.map((k) => (
                  <li
                    key={k.slug}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-bg"
                  >
                    <span className="ml-[30px] h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate text-[13.5px] text-ink-2">
                        {k.name}
                      </span>
                      <code className="text-[11px] text-muted">/{k.slug}</code>
                      <Count n={counts[k.slug] ?? 0} />
                    </span>
                    <RowActions
                      cat={k}
                      busy={busy === k.slug}
                      onDelete={() => remove(k, false)}
                    />
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
