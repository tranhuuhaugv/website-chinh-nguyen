"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "./Container";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSlider } from "./FlashSlider";
import { ProductImage } from "./ProductImage";
import { BoltIcon, FlameIcon } from "./icons";
import { formatPrice } from "@/lib/format";

// Ô "Flash Sale" nền tối kiểu sàn TMĐT, có 2 tab:
//  - "Đang diễn ra": sản phẩm flash sale + thanh flame "Còn X/Y" + đồng hồ.
//  - "Sản phẩm mới về": sản phẩm mới, tiêu đề đổi thành "SẢN PHẨM MỚI VỀ".
// Client Component vì cần state chuyển tab.

// Số suất còn / tổng cho thanh flame (minh hoạ — dữ liệu thật cần cột kho riêng).
const STOCK = [
  { remaining: 13, total: 20 },
  { remaining: 18, total: 20 },
  { remaining: 10, total: 10 },
  { remaining: 8, total: 10 },
  { remaining: 3, total: 3 },
  { remaining: 3, total: 3 },
];

function FlashCard({
  product,
  mode,
  stock,
}: {
  product: Product;
  mode: "flash" | "new";
  stock: { remaining: number; total: number };
}) {
  const cover = product.images?.[0];
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const pct = Math.max(6, Math.round((stock.remaining / stock.total) * 100));

  const isFlash = mode === "flash";

  return (
    <Link
      href={`/${product.slug}`}
      className="group relative flex w-[196px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.26)] max-[460px]:w-[156px]"
    >
      {/* Nhãn giảm giá / mới về dạng ruy-băng góc trên trái */}
      {isFlash && discount > 0 && (
        <span className="absolute left-0 top-3 z-[2] rounded-r-full bg-gradient-to-r from-[#FFB020] to-[#FF8A00] py-1 pl-2.5 pr-3 text-[12px] font-extrabold leading-none text-[#4A2400] shadow-md">
          -{discount}%
        </span>
      )}
      {!isFlash && (
        <span className="absolute left-0 top-3 z-[2] rounded-r-full bg-gradient-to-r from-[#0E5A66] to-[#14808A] py-1 pl-2.5 pr-3 text-[12px] font-extrabold leading-none text-white shadow-md">
          MỚI VỀ
        </span>
      )}

      {/* Ảnh trên nền sáng, phóng nhẹ khi hover */}
      <div className="relative mx-2 mt-2 aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-[#F6F7F9] to-white p-2.5">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="196px"
            className="object-contain p-1.5 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <ProductImage accent={product.accent} uid={product.slug} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 pt-2.5">
        <p className="mb-2 line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-snug text-ink">
          {product.name}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[17px] font-extrabold leading-tight text-sale">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <s className="text-[12px] text-muted">
              {formatPrice(product.oldPrice)}
            </s>
          )}
        </div>

        {isFlash ? (
          // Thanh tiến độ: còn hàng / tổng
          <div className="mt-3">
            <p className="mb-1 flex items-center gap-1 text-[11.5px] font-bold text-[#C2570C]">
              <FlameIcon className="h-3.5 w-3.5" />
              Còn {stock.remaining}/{stock.total} suất
            </p>
            <div className="h-[7px] overflow-hidden rounded-full bg-[#FFEBC8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFC53D] to-[#FF8A00]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-green-d">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Vừa lên kệ
          </div>
        )}
      </div>
    </Link>
  );
}

/** "YYYY-MM-DDTHH:mm" -> { gio: "HH:mm", ngay: "dd/MM" }. */
function tachGioNgay(s: string): { gio: string; ngay: string } {
  const [d, t = ""] = s.split("T");
  const [, mo = "", day = ""] = d.split("-");
  return { gio: t.slice(0, 5), ngay: `${day}/${mo}` };
}

/** Nhãn khung giờ Flash Sale theo lịch admin đặt (đồng bộ với đồng hồ). */
function khungGioLabel(start?: string, end?: string): string {
  if (start && end) {
    const a = tachGioNgay(start);
    const b = tachGioNgay(end);
    return a.ngay === b.ngay
      ? `${a.gio} – ${b.gio} · ${a.ngay}`
      : `${a.gio} ${a.ngay} – ${b.gio} ${b.ngay}`;
  }
  if (end) {
    const b = tachGioNgay(end);
    return `Đến ${b.gio} · ${b.ngay}`;
  }
  if (start) {
    const a = tachGioNgay(start);
    return `Từ ${a.gio} · ${a.ngay}`;
  }
  return "Trong hôm nay";
}

export function FlashSale({
  flashProducts,
  newProducts,
  startsAt,
  endsAt,
}: {
  flashProducts: Product[];
  newProducts: Product[];
  /** Giờ bắt đầu Flash Sale (giờ VN "YYYY-MM-DDTHH:mm"). Trống -> không giới hạn. */
  startsAt?: string;
  /** Giờ kết thúc Flash Sale (giờ VN "YYYY-MM-DDTHH:mm"). Trống -> hết ngày. */
  endsAt?: string;
}) {
  const [tab, setTab] = useState<"flash" | "new">("flash");
  const hasNew = newProducts.length > 0;
  const isFlash = tab === "flash" || !hasNew;
  const products = isFlash ? flashProducts : newProducts;
  const title = isFlash ? "FLASH SALE" : "SẢN PHẨM MỚI VỀ";

  const Tab = ({
    active,
    onClick,
    label,
    sub,
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
    sub: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-1.5 text-center transition ${
        active
          ? "bg-white shadow-md"
          : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <p
        className={`text-[13px] font-bold ${
          active ? "text-[#0E5A66]" : "text-white"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[11.5px] font-medium ${
          active ? "text-muted" : "text-white/75"
        }`}
      >
        {sub}
      </p>
    </button>
  );

  return (
    <section className="py-[18px]">
      <Container>
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B3B4F] via-[#0E5A66] to-[#14808A] p-4 shadow-product max-[640px]:p-3"
        >
          {/* Vệt sáng trang trí */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFB020]/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl"
          />
          {/* Header: logo (tiêu đề đổi theo tab) + đồng hồ + tab */}
          <div className="relative mb-3 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1 max-[640px]:gap-0.5">
              <BoltIcon className="sale-bolt h-6 w-6 -rotate-6 text-[#FFCF33]" />
              <span className="sale-shimmer inline-block py-1 pr-1.5 text-[26px] font-black italic leading-[1.3] max-[640px]:text-[19px]">
                {title}
              </span>
              <BoltIcon className="sale-bolt h-6 w-6 rotate-6 text-[#FFCF33]" />
            </div>

            {isFlash && <CountdownTimer endsAt={endsAt} />}

            {/* Tab: Đang diễn ra / Sản phẩm mới về */}
            <div className="ml-auto flex items-center gap-2 max-[900px]:ml-0">
              <Tab
                active={isFlash}
                onClick={() => setTab("flash")}
                label="Đang diễn ra"
                sub={khungGioLabel(startsAt, endsAt)}
              />
              {hasNew && (
                <Tab
                  active={!isFlash}
                  onClick={() => setTab("new")}
                  label="Sản phẩm mới về"
                  sub="Vừa cập nhật"
                />
              )}
            </div>
          </div>

          {/* Sản phẩm — 1 hàng cuộn ngang, có nút ‹ › + kéo chuột.
              key={tab} để cuộn về đầu khi đổi tab. */}
          <div className="relative">
          <FlashSlider key={tab}>
            {products.map((product, i) => (
              <FlashCard
                key={product.id}
                product={product}
                mode={isFlash ? "flash" : "new"}
                stock={STOCK[i % STOCK.length]}
              />
            ))}
          </FlashSlider>
          </div>
        </div>
      </Container>
    </section>
  );
}
