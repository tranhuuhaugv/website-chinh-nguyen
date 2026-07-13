"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";
import type { Category } from "@/lib/types";

// Quản lý danh mục: sắp xếp thứ tự (nút lên/xuống) + sửa/xoá/thêm.
// Thứ tự lưu qua PATCH /api/admin/categories { order: slug[] }.

export function CategoryAdminTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [list, setList] = useState(categories);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    setList((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  }

  async function saveOrder() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: list.map((c) => c.slug) }),
      });
      if (res.ok) {
        setDirty(false);
        router.refresh();
      } else {
        alert("Lưu thứ tự thất bại, vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Category) {
    if (!confirm(`Xoá danh mục "${c.name}"?`)) return;
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
            Dùng nút ↑ ↓ để đổi thứ tự hiển thị, rồi bấm “Lưu thứ tự”.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              type="button"
              onClick={saveOrder}
              disabled={saving}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-green px-3.5 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu thứ tự"}
            </button>
          )}
          <Link
            href="/admin/danh-muc/them"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3.5 text-sm font-semibold text-ink-2 transition hover:border-green hover:text-green-d"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm danh mục
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Thứ tự</th>
              <th className="px-4 py-3 font-semibold">Tên danh mục</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Nhãn</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c, i) => (
              <tr
                key={c.slug}
                className="border-b border-line last:border-0 hover:bg-bg/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 tabular-nums text-muted">{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Lên"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-2 transition hover:border-green hover:text-green-d disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === list.length - 1}
                      aria-label="Xuống"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-2 transition hover:border-green hover:text-green-d disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3">
                  <code className="text-muted">/{c.slug}</code>
                </td>
                <td className="px-4 py-3 text-ink-2">{c.tag ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/danh-muc/${c.slug}`}
                      aria-label="Sửa"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Xoá"
                      disabled={busy === c.slug}
                      onClick={() => remove(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
