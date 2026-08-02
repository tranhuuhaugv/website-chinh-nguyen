"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "@/components/icons";
import type { Voucher } from "@/lib/vouchers";

// Sửa danh sách MÃ GIẢM GIÁ. Lưu Setting "vouchers" (JSON). Áp dụng cho khối
// voucher trang chủ + ô nhập mã ở giỏ + kiểm tra khi đặt hàng.

// "2000000" | "2.000.000" -> "2.000.000"; đọc số -> bỏ dấu chấm.
const fmt = (raw: string) => {
  const d = (raw ?? "").replace(/\D/g, "");
  return d ? d.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
};
const num = (raw: string) => Number((raw ?? "").replace(/\D/g, "")) || 0;

type Row = { code: string; amount: string; minSubtotal: string; quantity: string };

export function VouchersManager({ initial }: { initial: Voucher[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(
    initial.map((v) => ({
      code: v.code,
      amount: fmt(String(v.amount)),
      minSubtotal: fmt(String(v.minSubtotal)),
      quantity: String(v.quantity),
    })),
  );
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  function upd(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    setStatus("idle");
  }
  const addRow = () => {
    setRows((p) => [...p, { code: "", amount: "", minSubtotal: "", quantity: "" }]);
    setStatus("idle");
  };
  const removeRow = (i: number) => {
    setRows((p) => p.filter((_, idx) => idx !== i));
    setStatus("idle");
  };

  async function save() {
    const clean = rows
      .map((r) => ({
        code: r.code.trim().toUpperCase(),
        amount: num(r.amount),
        minSubtotal: num(r.minSubtotal),
        quantity: num(r.quantity),
      }))
      .filter((v) => v.code && v.amount > 0);
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "vouchers", value: JSON.stringify(clean) }),
      });
      if (res.ok) {
        setStatus("done");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inp =
    "h-10 min-w-0 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none focus:border-green";

  return (
    <div className="flex flex-col gap-3">
      {/* Nhãn cột (desktop) */}
      <div className="hidden gap-2 px-1 text-[11.5px] font-semibold uppercase tracking-wide text-muted sm:grid sm:grid-cols-[1fr_1.2fr_1.4fr_0.8fr_auto]">
        <span>Mã</span>
        <span>Giảm (đ)</span>
        <span>Đơn tối thiểu (đ)</span>
        <span>Số lượt</span>
        <span />
      </div>

      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1.2fr_1.4fr_0.8fr_auto] sm:items-center"
        >
          <input
            value={r.code}
            onChange={(e) => upd(i, { code: e.target.value.toUpperCase() })}
            placeholder="CN100K"
            className={`${inp} font-bold tracking-wide`}
          />
          <input
            value={r.amount}
            inputMode="numeric"
            onChange={(e) => upd(i, { amount: fmt(e.target.value) })}
            placeholder="100.000"
            className={inp}
          />
          <input
            value={r.minSubtotal}
            inputMode="numeric"
            onChange={(e) => upd(i, { minSubtotal: fmt(e.target.value) })}
            placeholder="5.000.000"
            className={inp}
          />
          <input
            value={r.quantity}
            inputMode="numeric"
            onChange={(e) => upd(i, { quantity: e.target.value.replace(/\D/g, "") })}
            placeholder="100"
            className={inp}
          />
          <button
            type="button"
            aria-label="Xoá"
            onClick={() => removeRow(i)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale max-sm:col-span-2 max-sm:w-full"
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
          Thêm mã
        </button>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="h-9 rounded-lg bg-green px-4 text-[13px] font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu mã giảm giá"}
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
