import Link from "next/link";
import type { VariantOption } from "@/lib/data";
import { shortSize } from "@/lib/format";

// Nút chọn cấu hình (máy cùng dòng khác RAM/ổ cứng, do admin nối link).
// Mỗi bản là 1 sản phẩm riêng -> bấm là sang trang máy đó. Server Component:
// dùng next/link, không tốn JS.

export function ProductVariants({
  options,
  currentSlug,
}: {
  options: VariantOption[];
  currentSlug: string;
}) {
  // Luôn hiện, kể cả khi chỉ có nút của chính máy đang xem.
  if (!options.length) return null;

  const base =
    "rounded-xl border px-4 py-2 text-[13px] font-semibold transition";

  return (
    <div className="mt-5">
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
        Dung lượng
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          // Ưu tiên ô Dung lượng admin nhập; không có thì tự ghép gọn RAM - Ổ cứng.
          const label = o.capacity?.trim()
            ? o.capacity
            : `${shortSize(o.ram)} - ${shortSize(o.storage)}`;
          if (o.slug === currentSlug) {
            return (
              <span
                key={o.slug}
                aria-current="true"
                className={`${base} border-green bg-green-tint text-green-d`}
              >
                {label}
              </span>
            );
          }
          return (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className={`${base} border-line bg-white text-ink-2 hover:border-green hover:text-green-d`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
