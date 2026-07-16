import Link from "next/link";
import type { VariantOption } from "@/lib/data";

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
  if (options.length < 2) return null;

  const base =
    "rounded-xl border px-4 py-2 text-[13px] font-semibold transition";

  return (
    <div className="mt-5">
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
        Dung lượng
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const label = `${o.ram} - ${o.storage}`;
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
              href={`/san-pham/${o.slug}`}
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
