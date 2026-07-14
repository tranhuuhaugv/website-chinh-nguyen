"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";

// Quản lý thương hiệu: thêm / đổi tên / xoá (chặn xoá khi hãng còn sản phẩm).

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export function BrandAdminTable({ brands }: { brands: AdminBrand[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(brands);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function add() {
    const n = name.trim();
    if (!n) return;
    setBusy("add");
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n }),
      });
      if (res.ok) {
        setName("");
        router.refresh();
      } else {
        alert("Thêm thương hiệu thất bại.");
      }
    } finally {
      setBusy(null);
    }
  }

  async function rename(b: AdminBrand) {
    const n = prompt("Tên thương hiệu mới:", b.name)?.trim();
    if (!n || n === b.name) return;
    setBusy(b.id);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, name: n }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((x) => (x.id === b.id ? { ...x, name: n } : x)));
        router.refresh();
      } else {
        alert("Cập nhật thất bại.");
      }
    } finally {
      setBusy(null);
    }
  }

  async function remove(b: AdminBrand) {
    if (b.count > 0) {
      alert(
        `Không xoá được: thương hiệu "${b.name}" đang có ${b.count} sản phẩm. Hãy xoá/chuyển sản phẩm trước.`,
      );
      return;
    }
    if (!confirm(`Xoá thương hiệu "${b.name}"?`)) return;
    setBusy(b.id);
    try {
      const res = await fetch(`/api/admin/brands?id=${b.id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((x) => x.id !== b.id));
        router.refresh();
      } else {
        const d = await res.json().catch(() => null);
        alert(
          d?.error === "has_products"
            ? `Không xoá được: hãng còn ${d.count} sản phẩm.`
            : "Xoá thất bại.",
        );
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[20px] font-bold text-ink">
          Quản lý thương hiệu ({rows.length})
        </h1>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Hãng đang có sản phẩm sẽ không xoá được (tránh mất dữ liệu sản phẩm).
        </p>
      </div>

      {/* Thêm nhanh */}
      <div className="flex gap-2 rounded-2xl border border-line bg-white p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Tên thương hiệu mới (VD: Gigabyte)"
          className="h-10 flex-1 rounded-lg border border-line px-3 text-sm outline-none focus:border-green"
        />
        <button
          type="button"
          onClick={add}
          disabled={busy === "add" || !name.trim()}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-green px-4 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Thương hiệu</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Số sản phẩm</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0 hover:bg-bg/60">
                <td className="px-4 py-3 font-medium text-ink">{b.name}</td>
                <td className="px-4 py-3">
                  <code className="text-muted">/{b.slug}</code>
                </td>
                <td className="px-4 py-3 text-ink-2">{b.count} sản phẩm</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      aria-label="Đổi tên"
                      disabled={busy === b.id}
                      onClick={() => rename(b)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-green hover:text-green-d disabled:opacity-40"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Xoá"
                      disabled={busy === b.id || b.count > 0}
                      title={b.count > 0 ? "Hãng còn sản phẩm, không xoá được" : "Xoá"}
                      onClick={() => remove(b)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-30"
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
