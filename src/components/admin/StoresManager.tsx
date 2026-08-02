"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "@/components/icons";
import type { Store } from "@/lib/types";

// Thêm/sửa/xoá cửa hàng trong hệ thống. Lưu Setting "stores" (JSON).
// Áp dụng ngay cho Footer, trang Hệ thống cửa hàng, Liên hệ, chi tiết SP...

export function StoresManager({ initial }: { initial: Store[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Store[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  function setField(i: number, field: keyof Store, value: string) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );
    setStatus("idle");
  }
  function addRow() {
    setRows((prev) => [...prev, { name: "", address: "", city: "Đà Nẵng" }]);
    setStatus("idle");
  }
  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    setStatus("idle");
  }

  async function save() {
    // Bỏ dòng thiếu tên hoặc địa chỉ; city trống -> mặc định "Đà Nẵng".
    const clean = rows
      .map((r) => ({
        name: r.name.trim(),
        address: r.address.trim(),
        city: r.city.trim() || "Đà Nẵng",
      }))
      .filter((r) => r.name && r.address);
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "stores", value: JSON.stringify(clean) }),
      });
      if (res.ok) {
        setRows(clean);
        setStatus("done");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "h-10 min-w-0 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none focus:border-green";

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && (
        <p className="text-[13px] text-muted">
          Chưa có cửa hàng nào. Bấm “Thêm cửa hàng” để bắt đầu.
        </p>
      )}

      {rows.map((r, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-xl border border-line bg-bg/40 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-muted">
              Cửa hàng {i + 1}
            </span>
            <button
              type="button"
              aria-label="Xoá cửa hàng"
              onClick={() => removeRow(i)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-[1fr_1.4fr_140px]">
            <input
              value={r.name}
              onChange={(e) => setField(i, "name", e.target.value)}
              placeholder="Tên (VD: Chính Nguyễn - Đỗ Quang)"
              className={inputCls}
            />
            <input
              value={r.address}
              onChange={(e) => setField(i, "address", e.target.value)}
              placeholder="Địa chỉ (VD: 175/8 Đỗ Quang - TP. Đà Nẵng)"
              className={inputCls}
            />
            <input
              value={r.city}
              onChange={(e) => setField(i, "city", e.target.value)}
              placeholder="Thành phố"
              className={inputCls}
            />
          </div>
        </div>
      ))}

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addRow}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-green/50 px-3 text-[13px] font-semibold text-green-d transition hover:bg-green-tint"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm cửa hàng
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="h-9 rounded-lg bg-green px-4 text-[13px] font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu danh sách"}
        </button>
        {status === "done" && (
          <span className="text-[12.5px] text-green-d">Đã lưu ✓</span>
        )}
        {status === "error" && (
          <span className="text-[12.5px] text-sale">Lưu thất bại</span>
        )}
      </div>
    </div>
  );
}
