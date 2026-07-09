import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Đường dẫn phân cấp (Trang chủ / Danh mục / Sản phẩm). Server Component. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-line">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-green-d">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-2">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
