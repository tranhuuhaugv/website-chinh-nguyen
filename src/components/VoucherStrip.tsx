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

export function VoucherStrip() {
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
    <section className="py-[18px]">
      <Container>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          {VOUCHERS.map((v, i) => {
            const style = STYLES[i % STYLES.length];
            return (
            <div
              key={v.code}
              className="relative flex overflow-hidden rounded-2xl border border-line bg-white shadow-card"
            >
              {/* Vế trái: mệnh giá */}
              <div className={`flex w-[112px] shrink-0 flex-col items-center justify-center gap-0.5 bg-gradient-to-br px-2 text-white ${style.panel}`}>
                <TagIcon className="h-4 w-4 opacity-80" />
                <b className="text-[19px] font-extrabold leading-tight">
                  {Math.round(v.amount / 1000)}K
                </b>
                <span className="text-[10.5px] uppercase tracking-wide text-white/75">
                  Voucher
                </span>
              </div>

              {/* Răng cưa giữa vé */}
              <div className="relative w-0 border-l-2 border-dashed border-line">
                <span className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full border border-line bg-bg" />
                <span className="absolute -bottom-[7px] -left-[7px] h-3.5 w-3.5 rounded-full border border-line bg-bg" />
              </div>

              {/* Vế phải: mã + điều kiện + nút chép */}
              <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <b className="block text-[15.5px] font-extrabold tracking-wide text-ink">
                    {v.code}
                  </b>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted">
                    Giảm {formatPrice(v.amount)} cho đơn từ{" "}
                    {formatPrice(v.minSubtotal)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(v.code)}
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-bold transition ${
                    copied === v.code
                      ? style.btnDone
                      : `text-white ${style.btn}`
                  }`}
                >
                  {copied === v.code ? (
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
