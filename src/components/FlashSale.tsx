import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "./Container";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSlider } from "./FlashSlider";
import { ProductImage } from "./ProductImage";
import { BoltIcon, FlameIcon } from "./icons";
import { formatPrice } from "@/lib/format";

// Khối Flash Sale kiểu "sàn TMĐT": nền tối, chữ FLASH SALE vàng + tia sét,
// đồng hồ đếm ngược, tab khung giờ, thẻ sản phẩm nền tối + thanh "flame" còn hàng.
// Server Component; chỉ CountdownTimer là Client.

// Số suất còn / tổng cho thanh flame (minh hoạ — dữ liệu thật cần cột kho riêng).
const STOCK = [
  { remaining: 13, total: 20 },
  { remaining: 18, total: 20 },
  { remaining: 10, total: 10 },
  { remaining: 8, total: 10 },
  { remaining: 3, total: 3 },
  { remaining: 3, total: 3 },
];

function FlashCard({ product, stock }: { product: Product; stock: { remaining: number; total: number } }) {
  const cover = product.images?.[0];
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const pct = Math.max(6, Math.round((stock.remaining / stock.total) * 100));

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex w-[186px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2e] transition hover:border-white/25 hover:bg-[#313136] max-[460px]:w-[150px]"
    >
      {/* Ảnh trên nền trắng (ảnh sản phẩm chụp nền trắng) */}
      <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-lg bg-white p-2.5">
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

        {/* Thanh flame: còn hàng / tổng */}
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
      </div>
    </Link>
  );
}

export function FlashSale({ products }: { products: Product[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-[#1c1c1e] p-4 shadow-product max-[640px]:p-3">
          {/* Header: logo FLASH SALE + đồng hồ + tab khung giờ */}
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1 max-[640px]:gap-0.5">
              <BoltIcon className="h-6 w-6 -rotate-6 text-[#FFCF33]" />
              <span className="bg-gradient-to-b from-[#FFE259] to-[#FDBA2D] bg-clip-text text-[26px] font-black italic tracking-tight text-transparent drop-shadow-sm max-[640px]:text-[21px]">
                FLASH SALE
              </span>
              <BoltIcon className="h-6 w-6 rotate-6 text-[#FFCF33]" />
            </div>

            <CountdownTimer />

            {/* Tab khung giờ */}
            <div className="ml-auto flex items-center gap-5 max-[900px]:ml-0">
              <div className="text-center">
                <p className="text-[13px] font-bold text-white">Đang diễn ra</p>
                <p className="mx-auto mt-0.5 w-max border-b-2 border-[#3B82F6] pb-0.5 text-[13px] font-bold text-[#60A5FA]">
                  09:00 – 23:59
                </p>
              </div>
              <div className="text-center opacity-70">
                <p className="text-[13px] font-medium text-white/70">Ngày mai</p>
                <p className="mt-0.5 text-[13px] font-medium text-white/60">
                  09:00 – 23:59
                </p>
              </div>
            </div>
          </div>

          {/* Sản phẩm — 1 hàng cuộn ngang, có nút ‹ › + kéo chuột */}
          <FlashSlider>
            {products.map((product, i) => (
              <FlashCard
                key={product.id}
                product={product}
                stock={STOCK[i % STOCK.length]}
              />
            ))}
          </FlashSlider>
        </div>
      </Container>
    </section>
  );
}
