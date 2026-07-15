import type { ProductAccent } from "@/lib/types";
import { ProductImage } from "@/components/ProductImage";
import { ProductGalleryClient } from "./ProductGalleryClient";

// Khu ảnh sản phẩm: ảnh lớn + hàng ảnh nhỏ. Khung VUÔNG 1:1 -> ảnh thật nên 1600x1600.
// Có ảnh thật -> ProductGalleryClient (bấm đổi ảnh được).
// Chưa có ảnh  -> vẽ SVG minh hoạ ngay tại Server Component (khỏi tốn JS).

export function ProductGallery({
  accent,
  slug,
  name,
  badge,
  images,
}: {
  accent: ProductAccent;
  slug: string;
  name: string;
  badge?: string;
  images?: string[];
}) {
  if (images?.length) {
    return <ProductGalleryClient images={images} name={name} badge={badge} />;
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white to-[#F4F7F4] p-6 shadow-card">
        {badge && (
          <span className="absolute left-4 top-4 z-[2] rounded-full bg-sale px-3 py-1 text-[12px] font-bold text-white">
            {badge}
          </span>
        )}
        <div className="mx-auto aspect-square max-w-[460px] overflow-hidden rounded-xl">
          <ProductImage accent={accent} uid={`${slug}-main`} />
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`aspect-square w-[76px] overflow-hidden rounded-xl border-2 bg-white p-1.5 transition ${
              i === 0 ? "border-green" : "border-line hover:border-green/50"
            }`}
            aria-label={`${name} - ảnh ${i + 1}`}
          >
            <div className="h-full w-full overflow-hidden rounded-lg">
              <ProductImage accent={accent} uid={`${slug}-thumb-${i}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
