"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/format";
import {
  PC_PART_TYPES,
  pcPartTypeShort,
  type PcPart,
} from "@/lib/pc-parts";
import { CartIcon, CheckIcon, TrashIcon } from "@/components/icons";

// Bộ cấu hình PC: khách chọn 1 linh kiện cho mỗi nhóm -> tổng tiền tự cộng,
// thêm cả cấu hình vào giỏ (mỗi linh kiện = 1 dòng) để thanh toán COD như thường.

export function PcBuilder({ parts }: { parts: PcPart[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Nhóm linh kiện theo loại (giữ thứ tự PC_PART_TYPES).
  const partsByType = useMemo(() => {
    const map: Record<string, PcPart[]> = {};
    for (const p of parts) (map[p.type] ??= []).push(p);
    return map;
  }, [parts]);

  const partById = useMemo(() => {
    const m = new Map<string, PcPart>();
    for (const p of parts) m.set(p.id, p);
    return m;
  }, [parts]);

  // type -> id linh kiện đang chọn.
  const [selected, setSelected] = useState<Record<string, string>>({});

  const chosen = PC_PART_TYPES.map((t) => ({
    type: t,
    part: selected[t.key] ? partById.get(selected[t.key]) : undefined,
  })).filter((x) => x.part) as { type: (typeof PC_PART_TYPES)[number]; part: PcPart }[];

  const total = chosen.reduce((s, c) => s + c.part.price, 0);
  const missingRequired = PC_PART_TYPES.filter(
    (t) => t.required && !selected[t.key],
  );

  function pick(typeKey: string, id: string) {
    setAdded(false);
    setSelected((prev) => {
      const next = { ...prev };
      if (id) next[typeKey] = id;
      else delete next[typeKey];
      return next;
    });
  }

  function reset() {
    setSelected({});
    setAdded(false);
  }

  function addToCart() {
    if (!chosen.length) return;
    for (const { type, part } of chosen) {
      addItem(
        {
          id: `pc-${part.id}`,
          slug: "build-pc",
          name: `[Build PC] ${pcPartTypeShort(type.key)}: ${part.name}`,
          price: part.price,
          accent: "dark",
          image: part.image ?? undefined,
        },
        1,
      );
    }
    setAdded(true);
    router.push("/gio-hang");
  }

  const selectCls =
    "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-green disabled:bg-bg disabled:text-muted";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Cột trái: chọn linh kiện từng nhóm */}
      <div className="flex flex-col gap-3">
        {PC_PART_TYPES.map((t) => {
          const list = partsByType[t.key] ?? [];
          const sel = selected[t.key] ? partById.get(selected[t.key]) : undefined;
          return (
            <div
              key={t.key}
              className="rounded-2xl border border-line bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[14px] font-bold text-ink">{t.label}</span>
                {t.required && (
                  <span className="rounded-full bg-green-soft px-2 py-0.5 text-[10.5px] font-semibold text-green-d">
                    Bắt buộc
                  </span>
                )}
              </div>

              <select
                value={selected[t.key] ?? ""}
                disabled={list.length === 0}
                onChange={(e) => pick(t.key, e.target.value)}
                className={selectCls}
              >
                <option value="">
                  {list.length
                    ? `— Chọn ${pcPartTypeShort(t.key)} —`
                    : "Chưa có linh kiện nhóm này"}
                </option>
                {list.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {formatPrice(p.price)}
                  </option>
                ))}
              </select>

              {sel && (
                <div className="mt-2 flex items-start justify-between gap-3 rounded-xl bg-bg px-3 py-2">
                  <div className="min-w-0 text-[12.5px] text-ink-2">
                    {sel.brand && (
                      <b className="text-ink">{sel.brand} · </b>
                    )}
                    {sel.note || sel.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => pick(t.key, "")}
                    className="shrink-0 text-[12px] font-medium text-muted transition hover:text-sale"
                  >
                    Bỏ chọn
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cột phải: tóm tắt cấu hình + tổng tiền */}
      <aside className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <h2 className="text-[15px] font-bold text-ink">Cấu hình của bạn</h2>

        {chosen.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted">
            Chưa chọn linh kiện nào. Hãy chọn ở danh sách bên trái.
          </p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-line">
            {chosen.map(({ type, part }) => (
              <div key={type.key} className="flex justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {pcPartTypeShort(type.key)}
                  </div>
                  <div className="text-[13px] font-medium text-ink">
                    {part.name}
                  </div>
                </div>
                <div className="whitespace-nowrap text-[13px] font-semibold text-ink">
                  {formatPrice(part.price)}
                </div>
              </div>
            ))}
          </div>
        )}

        {missingRequired.length > 0 && (
          <p className="mt-3 rounded-lg bg-[#FFF7E6] px-3 py-2 text-[12px] text-[#92400E]">
            Nên chọn thêm:{" "}
            {missingRequired.map((t) => pcPartTypeShort(t.key)).join(", ")}.
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[14px] font-bold text-ink">Tổng chi phí</span>
          <span className="text-[22px] font-extrabold text-sale">
            {formatPrice(total)}
          </span>
        </div>

        {added && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
            <CheckIcon className="h-4 w-4" />
            Đã thêm cấu hình vào giỏ hàng.
          </p>
        )}

        <button
          type="button"
          onClick={addToCart}
          disabled={chosen.length === 0}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green text-[15px] font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CartIcon className="h-[18px] w-[18px]" />
          Thêm cấu hình vào giỏ
        </button>

        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={reset}
            disabled={chosen.length === 0}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line text-[13px] font-semibold text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-40"
          >
            <TrashIcon className="h-4 w-4" />
            Làm mới
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={chosen.length === 0}
            className="flex h-10 items-center justify-center rounded-xl border border-line text-[13px] font-semibold text-ink-2 transition hover:border-green hover:text-green-d disabled:opacity-40"
          >
            In / Lưu PDF
          </button>
        </div>

        <p className="mt-3 text-center text-[12px] text-muted">
          Đặt hàng để shop liên hệ tư vấn &amp; báo giá ráp máy chính xác.
        </p>
      </aside>
    </div>
  );
}
