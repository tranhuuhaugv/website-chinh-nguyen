import Link from "next/link";
import { ArrowRightIcon } from "./icons";

/** Tiêu đề section: thanh xanh + h2, kèm link "Xem tất cả" tuỳ chọn. */
export function SectionHead({
  title,
  moreHref,
  moreLabel = "Xem tất cả",
}: {
  title: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2.5 text-[23px] font-bold tracking-[-0.02em]">
        <span className="h-6 w-[5px] rounded-[3px] bg-green" />
        {title}
      </h2>
      {moreHref && (
        <Link
          href={moreHref}
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13.5px] font-semibold text-green-d"
        >
          {moreLabel}
          <ArrowRightIcon className="h-[13px] w-[13px]" />
        </Link>
      )}
    </div>
  );
}
