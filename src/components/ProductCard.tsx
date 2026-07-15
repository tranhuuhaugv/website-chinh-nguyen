import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./cart/AddToCartButton";
import { CompareButton } from "./compare/CompareButton";
import {
  CartIcon,
  CpuIcon,
  HeartIcon,
  RamIcon,
  StarIcon,
  StorageIcon,
} from "./icons";

// Card sản phẩm dùng chung (Flash Sale + Sản phẩm nổi bật).
// Thiết kế tối giản: ảnh trên nền dịu, tên — cấu hình — đánh giá — giá — nút mua.
// Server Component; phần tương tác (So sánh) ở CompareButton (Client).

/** URL thân thiện theo slug (quy tắc SEO trong CLAUDE.md). */
function productHref(slug: string) {
  return `/san-pham/${slug}`;
}

export function ProductCard({
  product,
  progress,
}: {
  product: Product;
  /** Thanh "đã bán" cho Flash Sale (tuỳ chọn). */
  progress?: { sold: number; total: number };
}) {
  const href = productHref(product.slug);
  // Ảnh thật (nếu admin đã tải lên); chưa có -> ProductImage vẽ SVG minh hoạ.
  const cover = product.images?.[0];
  const soldPct = progress
    ? Math.min(100, Math.round((progress.sold / progress.total) * 100))
    : 0;
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-[#C9E4D2] hover:shadow-card-hover">
      {/* Ảnh trên panel nền dịu (gradient nhẹ cho có chiều sâu) */}
      <div className="relative m-2 rounded-xl bg-gradient-to-b from-white to-[#EAEEEA] p-3">
        {product.isNew ? (
          <span className="absolute left-2.5 top-2.5 z-[2] rounded-full bg-green px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(21,154,72,.35)]">
            Mới
          </span>
        ) : discount > 0 ? (
          <span className="absolute left-2.5 top-2.5 z-[2] rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(226,58,52,.35)]">
            -{discount}%
          </span>
        ) : product.badge ? (
          <span className="absolute left-2.5 top-2.5 z-[2] rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(226,58,52,.35)]">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Thêm vào yêu thích"
          className="absolute right-2.5 top-2.5 z-[2] flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/90 text-muted backdrop-blur transition hover:border-sale hover:text-sale"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
        <Link
          href={href}
          className="relative block aspect-square overflow-hidden rounded-lg"
        >
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 45vw, 240px"
              className="object-contain"
            />
          ) : (
            <ProductImage accent={product.accent} uid={product.slug} />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
        <Link href={href}>
          <h3 className="mb-2.5 line-clamp-2 min-h-[40px] text-[15px] font-semibold leading-snug text-ink transition group-hover:text-green-d">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2.5 flex flex-wrap gap-1.5 max-[459px]:hidden">
          <span className="flex items-center gap-1 rounded-md bg-bg px-2 py-1 text-[11px] text-ink-2">
            <CpuIcon className="h-3 w-3 text-green" />
            {product.cpu}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-bg px-2 py-1 text-[11px] text-ink-2">
            <RamIcon className="h-3 w-3 text-green" />
            {product.ram}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-bg px-2 py-1 text-[11px] text-ink-2">
            <StorageIcon className="h-3 w-3 text-green" />
            {product.storage}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-[12px] max-[459px]:hidden">
          <span className="flex gap-px text-amber">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-3 w-3" />
            ))}
          </span>
          <b className="font-bold text-ink">{product.rating.toFixed(1)}</b>
          <em className="not-italic text-muted">({product.reviewCount})</em>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[19px] font-extrabold text-sale">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[12.5px] text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <span className="mt-1 inline-block rounded-md bg-sale/10 px-1.5 py-0.5 text-[11px] font-bold text-sale max-[459px]:hidden">
              Tiết kiệm {formatPrice(savings)}
            </span>
          )}
        </div>

        {progress && (
          <div className="mt-2.5 h-4 overflow-hidden rounded-full bg-[#FCE3C7]">
            <div className="relative h-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber to-sale transition-all"
                style={{ width: `${Math.max(soldPct, 18)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-semibold text-[#7a3b00]">
                Đã bán {progress.sold}
              </span>
            </div>
          </div>
        )}

        <AddToCartButton
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            accent: product.accent,
          }}
          redirectTo="/gio-hang"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-d to-green py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(21,154,72,.25)] transition hover:shadow-[0_6px_16px_rgba(21,154,72,.38)]"
        >
          <CartIcon className="h-4 w-4" />
          Mua ngay
        </AddToCartButton>

        <CompareButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            accent: product.accent,
            price: product.price,
            oldPrice: product.oldPrice,
            cpu: product.cpu,
            ram: product.ram,
            storage: product.storage,
            rating: product.rating,
          }}
        />
      </div>
    </article>
  );
}
