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
import { SITE } from "@/lib/site";

// Chặn HTML injection khi in (tên linh kiện do admin nhập).
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  // In BẢNG BÁO GIÁ gọn (chỉ cấu hình + tổng tiền) trong cửa sổ riêng —
  // không in cả trang web.
  function printQuote() {
    if (!chosen.length) return;
    const w = window.open("", "_blank", "width=820,height=920");
    if (!w) {
      alert("Trình duyệt đang chặn cửa sổ in. Cho phép popup rồi thử lại.");
      return;
    }
    const d = new Date();
    const p2 = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${p2(d.getDate())}-${p2(d.getMonth() + 1)}-${d.getFullYear()}, ${p2(d.getHours())}:${p2(d.getMinutes())}`;

    const rows = chosen
      .map(
        ({ type, part }, i) => `
      <tr>
        <td class="c">${i + 1}</td>
        <td>${esc(pcPartTypeShort(type.key))}: ${esc(part.name)}${
          part.brand ? ` <span class="mut">(${esc(part.brand)})</span>` : ""
        }</td>
        <td class="c">1</td>
        <td class="r">${formatPrice(part.price)}</td>
        <td class="r">${formatPrice(part.price)}</td>
      </tr>`,
      )
      .join("");

    const stores = SITE.stores
      .map((s) => `<div>${esc(s.name)}: ${esc(s.address)}</div>`)
      .join("");

    w.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8" />
<title>Báo giá cấu hình PC - ${esc(SITE.name)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, "Segoe UI", sans-serif; color: #17201A; margin: 0; padding: 28px; font-size: 13px; }
  .head { display: flex; justify-content: space-between; gap: 20px; border-bottom: 3px solid #0A5C2A; padding-bottom: 14px; }
  .brand { font-size: 22px; font-weight: 800; color: #0A5C2A; }
  .brand small { display: block; font-size: 11px; font-weight: 600; color: #7A857E; letter-spacing: .5px; margin-top: 2px; }
  .info { text-align: right; font-size: 11.5px; line-height: 1.7; color: #3E4A42; }
  .info b { color: #17201A; }
  h1 { text-align: center; font-size: 18px; margin: 22px 0 6px; letter-spacing: .5px; }
  .meta { display: flex; justify-content: space-between; font-size: 11.5px; color: #7A857E; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #CBD5CF; padding: 8px 10px; vertical-align: top; }
  th { background: #EAF5EE; color: #0A5C2A; font-size: 12px; text-transform: uppercase; }
  td.c { text-align: center; }
  td.r { text-align: right; white-space: nowrap; }
  .mut { color: #7A857E; font-size: 11.5px; }
  tfoot td { font-weight: 800; background: #F2F5F2; }
  .total { color: #E23A34; font-size: 15px; }
  .note { margin-top: 16px; font-size: 11.5px; color: #7A857E; line-height: 1.7; }
  @media print { body { padding: 0; } }
</style></head>
<body>
  <div class="head">
    <div>
      <div class="brand">${esc(SITE.name)}<small>HỆ THỐNG LAPTOP - PC - LINH KIỆN</small></div>
    </div>
    <div class="info">
      ${stores}
      <div>Hotline: <b>${esc(SITE.hotline)}</b> · ${esc(SITE.email)}</div>
    </div>
  </div>

  <h1>BẢNG BÁO GIÁ CẤU HÌNH PC</h1>
  <div class="meta">
    <span>Ngày báo giá: ${dateStr}</span>
    <span>Đơn vị tính: VNĐ</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:44px">STT</th>
        <th>Tên sản phẩm</th>
        <th style="width:70px">Số lượng</th>
        <th style="width:130px">Đơn giá</th>
        <th style="width:130px">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="r">Tổng tiền đơn hàng</td>
        <td class="r total">${formatPrice(total)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="note">
    Báo giá có giá trị tham khảo tại thời điểm in, chưa gồm phí lắp ráp (nếu có).
    Vui lòng liên hệ ${esc(SITE.hotline)} để được tư vấn và chốt cấu hình chính xác.
  </div>
</body></html>`);
    w.document.close();
    w.focus();
    w.print();
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
            onClick={printQuote}
            disabled={chosen.length === 0}
            className="flex h-10 items-center justify-center rounded-xl border border-line text-[13px] font-semibold text-ink-2 transition hover:border-green hover:text-green-d disabled:opacity-40"
          >
            In báo giá
          </button>
        </div>

        <p className="mt-3 text-center text-[12px] text-muted">
          Đặt hàng để shop liên hệ tư vấn &amp; báo giá ráp máy chính xác.
        </p>
      </aside>
    </div>
  );
}
