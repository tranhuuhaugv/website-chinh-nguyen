"use client";

import { useState } from "react";
import { Container } from "./Container";
import { CheckIcon, TagIcon } from "./icons";
import { formatPrice } from "@/lib/format";
import { VOUCHERS } from "@/lib/vouchers";

// Dải mã giảm giá trên trang chủ (hiện khi bật Setting "vouchersEnabled").
// Khách bấm "Sao chép" rồi dán vào ô mã giảm giá ở giỏ hàng.

// Mỗi vé một tông màu (theo thứ tự trong VOUCHERS): xanh lá / xanh dương / cam-đỏ.
const STYLES = [
  {
    panel: "from-[#16A34A] to-[#0B5E2C]",
    btn: "bg-[#16A34A] hover:bg-[#0F8038]",
    btnDone: "bg-[#E7F5EC] text-[#0B5E2C]",
  },
  {
    panel: "from-[#3B82F6] to-[#1D4ED8]",
    btn: "bg-[#3B82F6] hover:bg-[#2563EB]",
    btnDone: "bg-[#E3EDFC] text-[#1D4ED8]",
  },
  {
    panel: "from-[#F97316] to-[#DC2626]",
    btn: "bg-[#F97316] hover:bg-[#EA580C]",
    btnDone: "bg-[#FDEEE2] text-[#C2410C]",
  },
];

// usage: map code -> số lượt đã dùng (từ server). Hết lượt -> vé chuyển "Hết mã".
export function VoucherStrip({ usage = {} }: { usage?: Record<string, number> }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Trình duyệt cũ: chọn thủ công — vẫn báo mã để khách tự gõ.
    }
    setCopied(code);
    setTimeout(() => setCopied((c) => (c === code ? null : c)), 2500);
  }

  return (
    <section className="py-3 max-[900px]:py-2">
      <Container>
        <div className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-1 max-[900px]:gap-1.5">
          {VOUCHERS.map((v, i) => {
            const style = STYLES[i % STYLES.length];
            const remaining = Math.max(0, v.quantity - (usage[v.code] ?? 0));
            const soldOut = remaining <= 0;
            return (
              <div
                key={v.code}
                className={`relative flex overflow-hidden rounded-2xl border border-line bg-white shadow-card ${
                  soldOut ? "opacity-60" : ""
                }`}
              >
                {/* Vế trái: mệnh giá */}
                <div
                  className={`flex w-[86px] shrink-0 flex-col items-center justify-center gap-0.5 bg-gradient-to-br px-2 text-white max-[900px]:w-[62px] ${
                    soldOut ? "grayscale" : style.panel
                  } ${soldOut ? "bg-[#94A3B8]" : ""}`}
                >
                  <TagIcon className="h-3.5 w-3.5 opacity-80 max-[900px]:hidden" />
                  <b className="text-[16px] font-extrabold leading-tight max-[900px]:text-[15px]">
                    {Math.round(v.amount / 1000)}K
                  </b>
                  <span className="text-[9.5px] uppercase tracking-wide text-white/75 max-[900px]:text-[8.5px]">
                    Voucher
                  </span>
                </div>

                {/* Răng cưa giữa vé */}
                <div className="relative w-0 border-l-2 border-dashed border-line">
                  <span className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full border border-line bg-bg" />
                  <span className="absolute -bottom-[7px] -left-[7px] h-3.5 w-3.5 rounded-full border border-line bg-bg" />
                </div>

                {/* Vế phải: mã + điều kiện + số còn lại + nút chép */}
                <div className="flex flex-1 items-center justify-between gap-3 px-3.5 py-2.5 max-[900px]:gap-2 max-[900px]:px-2.5 max-[900px]:py-1.5">
                  <div className="min-w-0">
                    <b className="flex items-baseline gap-2 text-[14px] font-extrabold tracking-wide text-ink max-[900px]:text-[13.5px]">
                      <span>{v.code}</span>
                      {/* Số mã còn lại: đứng cạnh mã trên mobile cho gọn 1 dòng */}
                      <span className="hidden text-[10.5px] font-semibold max-[900px]:inline">
                        {soldOut ? (
                          <span className="text-muted">Hết mã</span>
                        ) : (
                          <span className="text-sale">Còn {remaining}</span>
                        )}
                      </span>
                    </b>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-muted max-[900px]:mt-0 max-[900px]:line-clamp-1 max-[900px]:text-[10.5px] max-[900px]:leading-tight">
                      Giảm {formatPrice(v.amount)} cho đơn từ{" "}
                      {formatPrice(v.minSubtotal)}
                    </p>
                    {/* Dòng "Còn X mã" riêng: chỉ hiện trên desktop (mobile gộp lên cạnh mã) */}
                    <p className="mt-0.5 text-[11px] font-semibold max-[900px]:hidden">
                      {soldOut ? (
                        <span className="text-muted">Đã hết mã</span>
                      ) : (
                        <span className="text-sale">Còn {remaining} mã</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(v.code)}
                    disabled={soldOut}
                    className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition max-[900px]:h-7 max-[900px]:gap-1 max-[900px]:px-2.5 max-[900px]:text-[11px] ${
                      soldOut
                        ? "cursor-not-allowed bg-[#E5E7EB] text-muted"
                        : copied === v.code
                          ? style.btnDone
                          : `text-white ${style.btn}`
                    }`}
                  >
                    {soldOut ? (
                      "Hết mã"
                    ) : copied === v.code ? (
                      <>
                        <CheckIcon className="h-3.5 w-3.5" />
                        Đã chép
                      </>
                    ) : (
                      "Sao chép"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
