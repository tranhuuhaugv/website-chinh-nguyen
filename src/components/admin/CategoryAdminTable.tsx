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
import { normGroup } from "@/lib/category-groups";

// Quản lý danh mục — TÁCH THEO NHÓM cho rõ:
//  - Thương hiệu: hãng (Dell, HP…) có cây dòng máy con (Dell XPS…).
//  - Loại máy / Nhu cầu / Khác: danh mục "phẳng" (trang landing trong menu).
// Chỉ hãng mới có nút "+ Dòng máy". Con nhận diện qua group="dong-may" + tiền tố slug.

// Tên hiển thị + thứ tự nhóm (nhóm thương hiệu luôn lên đầu, xử lý riêng).
const GROUP_META: Record<string, { label: string; rank: number }> = {
  "thuong-hieu": { label: "Thương hiệu", rank: 0 },
  "Theo thương hiệu": { label: "Thương hiệu", rank: 0 },
  "loai-may": { label: "Loại máy", rank: 1 },
  "Loại máy": { label: "Loại máy", rank: 1 },
  "nhu-cau": { label: "Nhu cầu", rank: 2 },
  "Theo nhu cầu": { label: "Nhu cầu", rank: 2 },
  khac: { label: "Khác", rank: 3 },
  Khác: { label: "Khác", rank: 3 },
};
function groupLabel(key: string): string {
  if (key === "__none__") return "Khác";
  return GROUP_META[key]?.label ?? key;
}

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

  // Dựng cây + tách nhóm.
  const { sections, childrenOf, orphans, brandGroups } = useMemo(() => {
    const parents = list.filter((c) => normGroup(c.group) !== "dong-may");
    const series = list.filter((c) => normGroup(c.group) === "dong-may");

    // Con (dòng máy) gắn vào cha có slug là tiền tố dài nhất khớp.
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

    // Gom cha theo group ĐÃ CHUẨN HOÁ -> "nhu-cau" và "Theo nhu cầu" gộp làm 1.
    const byGroup: Record<string, Category[]> = {};
    for (const p of parents) {
      const g = normGroup(p.group) || "__none__";
      (byGroup[g] ??= []).push(p);
    }
    // Nhóm "thương hiệu" = nhóm có cha chứa dòng máy con.
    const brandGroups = new Set<string>();
    for (const [g, ps] of Object.entries(byGroup)) {
      if (ps.some((p) => (childrenOf[p.slug]?.length ?? 0) > 0)) brandGroups.add(g);
    }
    const rankOf = (g: string) =>
      brandGroups.has(g) ? 0 : (GROUP_META[g]?.rank ?? 2.5);
    const sections = Object.entries(byGroup)
      .map(([key, ps]) => ({ key, parents: ps }))
      .sort((a, b) => rankOf(a.key) - rankOf(b.key));

    return { sections, childrenOf, orphans, brandGroups };
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

  // 1 hàng danh mục lớn. isBrand -> có cây dòng máy + nút "+ Dòng máy".
  function ParentRow({ p, isBrand }: { p: Category; isBrand: boolean }) {
    const kids = childrenOf[p.slug] ?? [];
    const hasKids = kids.length > 0;
    const opened = isOpen(p.slug);
    return (
      <li>
        <div className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg">
          <button
            type="button"
            onClick={() => hasKids && toggle(p.slug)}
            aria-label={opened ? "Thu gọn" : "Mở"}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-2 ${
              isBrand && hasKids ? "hover:bg-line" : "invisible"
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
            {isBrand && hasKids && (
              <span className="text-[11.5px] text-muted">· {kids.length} dòng</span>
            )}
          </span>
          {isBrand && (
            <Link
              href={`/admin/danh-muc/them?parent=${encodeURIComponent(p.slug)}&brand=${encodeURIComponent(p.name)}&icon=${encodeURIComponent(p.icon)}`}
              className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-green/50 px-2.5 text-[12.5px] font-semibold text-green-d transition hover:bg-green-tint"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Dòng máy
            </Link>
          )}
          <RowActions
            cat={p}
            busy={busy === p.slug}
            onDelete={() => remove(p, hasKids)}
          />
        </div>

        {isBrand && opened && hasKids && (
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
  }

  return (
    <div className="rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div>
          <h1 className="text-[17px] font-bold text-ink">Quản lý danh mục</h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Tách theo nhóm. Chỉ <b>Thương hiệu</b> có cây dòng máy con; các nhóm
            khác là danh mục phẳng. Số trong ngoặc là số sản phẩm.
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

      <div className="flex flex-col gap-3 p-2 sm:p-3">
        {sections.map((sec) => {
          const isBrand = brandGroups.has(sec.key);
          return (
            <div key={sec.key}>
              <p className="px-2 pb-1 pt-1 text-[11.5px] font-bold uppercase tracking-wide text-muted">
                {groupLabel(sec.key)} ({sec.parents.length})
              </p>
              <ul className="flex flex-col">
                {sec.parents.map((p) => (
                  <ParentRow key={p.slug} p={p} isBrand={isBrand} />
                ))}
              </ul>
            </div>
          );
        })}

        {/* Dòng máy chưa gán hãng */}
        {orphans.length > 0 && (
          <div className="border-t border-line pt-2">
            <p className="px-2 py-1 text-[11.5px] font-bold uppercase tracking-wide text-muted">
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
          </div>
        )}
      </div>
    </div>
  );
}
