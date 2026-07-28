import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, shortCpu, shortSize } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./cart/AddToCartButton";
import { CompareButton } from "./compare/CompareButton";
import {
  CartIcon,
  CpuIcon,
  GpuIcon,
  MonitorIcon,
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
  showBuy = true,
}: {
  product: Product;
  /** Thanh "đã bán" cho Flash Sale (tuỳ chọn). */
  progress?: { sold: number; total: number };
  /** Ẩn nút "Mua ngay" (trang chủ dùng false — chỉ xem, bấm vào thẻ để mua). */
  showBuy?: boolean;
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

  // Thông số hiển thị trên thẻ (xếp dọc): CPU / RAM / SSD / Card / Màn hình.
  // Bỏ trường trống — máy không có GPU rời hoặc chưa nhập màn hình thì ẩn dòng đó.
  const specs = [
    { Icon: CpuIcon, value: shortCpu(product.cpu) },
    { Icon: RamIcon, value: `RAM ${shortSize(product.ram)}` },
    { Icon: StorageIcon, value: `SSD ${shortSize(product.storage)}` },
    { Icon: GpuIcon, value: product.gpu },
    { Icon: MonitorIcon, value: product.screen },
  ].filter((s): s is { Icon: typeof CpuIcon; value: string } =>
    Boolean(s.value && s.value.trim()),
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-[#C9E4D2] hover:shadow-card-hover">
      {/* Ảnh trên panel nền dịu (gradient nhẹ cho có chiều sâu) */}
      <div className="relative m-2 rounded-xl bg-gradient-to-b from-white to-[#EAEEEA] p-3">
        {product.isNew ? (
          <span className="absolute left-2.5 top-2.5 z-[2] rounded-full bg-green px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(11,94,44,.35)]">
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
        {/* Nút thêm nhanh vào giỏ (thay nút yêu thích cũ). Không điều hướng —
            thêm tại chỗ; hiện rõ hơn khi rê chuột vào thẻ. */}
        <AddToCartButton
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            accent: product.accent,
          }}
          className="absolute right-2.5 top-2.5 z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/95 text-green-d shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-green-d hover:bg-green-d hover:text-white hover:shadow-md"
          ariaLabel={`Thêm ${product.name} vào giỏ`}
        >
          <CartIcon className="h-[18px] w-[18px]" />
        </AddToCartButton>
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
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <span className="block h-full w-full transition-transform duration-500 ease-out group-hover:scale-110">
              <ProductImage accent={product.accent} uid={product.slug} />
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
        <Link href={href}>
          <h3 className="mb-2.5 line-clamp-2 min-h-[40px] text-[15px] font-semibold leading-snug text-ink transition group-hover:text-green-d">
            {product.name}
          </h3>
        </Link>

        {/* Cấu hình xếp DỌC: CPU / RAM / SSD / Card / Màn hình (lấy từ thông số).
            Mỗi dòng 1 icon tròn nền xanh nhạt cho gọn gàng, dễ đọc. */}
        <ul className="mb-3 flex flex-col gap-1.5 rounded-xl bg-bg/70 p-2.5 max-[459px]:gap-1 max-[459px]:p-2">
          {specs.map(({ Icon, value }, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-[12px] leading-tight text-ink-2 max-[459px]:text-[11px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-soft text-green">
                <Icon className="h-3 w-3" />
              </span>
              <span className="truncate">{value}</span>
            </li>
          ))}
        </ul>

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

        {showBuy && (
          <AddToCartButton
            item={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              accent: product.accent,
            }}
            redirectTo="/gio-hang"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-d to-green py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(11,94,44,.25)] transition hover:shadow-[0_6px_16px_rgba(11,94,44,.38)]"
          >
            <CartIcon className="h-4 w-4" />
            Mua ngay
          </AddToCartButton>
        )}

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
