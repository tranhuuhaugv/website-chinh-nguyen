import Link from "next/link";
import { ArrowRightIcon } from "./icons";

/** Tiêu đề section: thanh gradient + h2 (kèm phụ đề tuỳ chọn) + link "Xem tất cả". */
export function SectionHead({
  title,
  subtitle,
  moreHref,
  moreLabel = "Xem tất cả",
}: {
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-7 w-[5px] shrink-0 rounded-full bg-gradient-to-b from-green to-green-dd" />
        <div>
          <h2 className="text-[23px] font-extrabold leading-none tracking-[-0.02em] max-[520px]:text-[20px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-[13px] text-muted max-[520px]:hidden">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-green-d transition hover:border-green hover:bg-green-tint"
        >
          {moreLabel}
          <ArrowRightIcon className="h-[13px] w-[13px]" />
        </Link>
      )}
    </div>
  );
}
