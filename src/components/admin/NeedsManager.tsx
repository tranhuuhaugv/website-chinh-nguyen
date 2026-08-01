"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { slugify } from "@/lib/slug";

// Sửa danh sách "nhu cầu sử dụng" (Gaming, Văn phòng…). Lưu Setting "needs" (JSON).
// Mã (value/slug) của mục CŨ giữ nguyên để không mất tag ở sản phẩm đã gắn.

type Row = { value: string; label: string };

export function NeedsManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  function setLabel(i: number, label: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, label } : r)));
    setStatus("idle");
  }
  function addRow() {
    setRows((prev) => [...prev, { value: "", label: "" }]);
    setStatus("idle");
  }
  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    setStatus("idle");
  }

  async function save() {
    // Chuẩn hoá: bỏ dòng trống; dòng mới (chưa có mã) tự tạo mã từ tên.
    const clean = rows
      .map((r) => ({
        value: (r.value || slugify(r.label)).trim(),
        label: r.label.trim(),
      }))
      .filter((r) => r.value && r.label);
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "needs", value: JSON.stringify(clean) }),
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

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={r.label}
            onChange={(e) => setLabel(i, e.target.value)}
            placeholder="Tên nhu cầu (VD: Gaming)"
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none focus:border-green"
          />
          <code className="w-32 shrink-0 truncate text-[11.5px] text-muted">
            {r.value || (r.label ? slugify(r.label) : "—")}
          </code>
          <button
            type="button"
            aria-label="Xoá"
            onClick={() => removeRow(i)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={addRow}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-green/50 px-3 text-[13px] font-semibold text-green-d transition hover:bg-green-tint"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm nhu cầu
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
