import Link from "next/link";
import { mergeParams, type RawParams } from "@/lib/product-query";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// Phân trang bằng link (giữ nguyên các bộ lọc khác trên URL). Server Component.

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string;
  searchParams: RawParams;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) =>
    basePath + mergeParams(searchParams, { trang: p === 1 ? undefined : p });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";

  return (
    <nav
      aria-label="Phân trang"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={href(page - 1)}
          aria-label="Trang trước"
          className={`${base} border-line bg-white text-ink-2 hover:border-green hover:text-green-d`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page}
          className={`${base} ${
            p === page
              ? "border-green bg-green text-white"
              : "border-line bg-white text-ink-2 hover:border-green hover:text-green-d"
          }`}
        >
          {p}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={href(page + 1)}
          aria-label="Trang sau"
          className={`${base} border-line bg-white text-ink-2 hover:border-green hover:text-green-d`}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
