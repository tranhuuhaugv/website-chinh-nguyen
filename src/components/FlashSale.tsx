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

  return (
    <Link
      href={`/${product.slug}`}
      className="group flex w-[186px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2e] transition hover:border-white/25 hover:bg-[#313136] max-[460px]:w-[150px]"
    >
      {/* Ảnh trên nền trắng (ảnh sản phẩm chụp nền trắng) */}
      <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-lg bg-white p-2.5">
        {mode === "new" && (
          <span className="absolute left-1.5 top-1.5 z-[2] rounded-md bg-green px-1.5 py-0.5 text-[10.5px] font-bold text-white shadow">
            MỚI VỀ
          </span>
        )}
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="186px"
            className="object-contain p-1"
          />
        ) : (
          <ProductImage accent={product.accent} uid={product.slug} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <p className="mb-1.5 line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-snug text-white/90">
          {product.name}
        </p>
        <div className="text-[16px] font-extrabold text-[#FFB020]">
          {formatPrice(product.price)}
        </div>
        {product.oldPrice && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <s className="text-[11.5px] text-white/40">
              {formatPrice(product.oldPrice)}
            </s>
            {discount > 0 && (
              <span className="rounded bg-sale px-1 py-px text-[10.5px] font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>
        )}

        {mode === "flash" ? (
          // Thanh flame: còn hàng / tổng
          <div className="relative mt-2.5 h-[18px] overflow-hidden rounded-full bg-[#4a4a4e]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FDBA2D] to-[#F97316]"
              style={{ width: `${pct}%` }}
            />
            <span className="absolute inset-0 flex items-center gap-1 px-2 text-[11px] font-bold text-[#5a2c00]">
              <FlameIcon className="h-3 w-3 text-[#C2410C]" />
              Còn {stock.remaining}/{stock.total}
            </span>
          </div>
        ) : (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#7EE0A0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
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
    <button type="button" onClick={onClick} className="text-center">
      <p
        className={`text-[13px] font-bold ${active ? "text-white" : "text-white/70"}`}
      >
        {label}
      </p>
      <p
        className={`mx-auto mt-0.5 w-max pb-0.5 text-[13px] font-bold ${
          active
            ? "border-b-2 border-[#3B82F6] text-[#60A5FA]"
            : "text-white/55"
        }`}
      >
        {sub}
      </p>
    </button>
  );

  return (
    <section className="py-[18px]">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-[#1c1c1e] p-4 shadow-product max-[640px]:p-3">
          {/* Header: logo (tiêu đề đổi theo tab) + đồng hồ + tab */}
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1 max-[640px]:gap-0.5">
              <BoltIcon className="h-6 w-6 -rotate-6 text-[#FFCF33]" />
              <span className="inline-block bg-gradient-to-b from-[#FFE259] to-[#FDBA2D] bg-clip-text py-1 pr-1.5 text-[26px] font-black italic leading-[1.3] text-transparent max-[640px]:text-[19px]">
                {title}
              </span>
              <BoltIcon className="h-6 w-6 rotate-6 text-[#FFCF33]" />
            </div>

            {isFlash && <CountdownTimer endsAt={endsAt} />}

            {/* Tab: Đang diễn ra / Sản phẩm mới về */}
            <div className="ml-auto flex items-center gap-5 max-[900px]:ml-0">
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
      </Container>
    </section>
  );
}
