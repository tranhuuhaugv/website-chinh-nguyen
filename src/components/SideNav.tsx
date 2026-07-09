import Link from "next/link";

// Menu dọc dùng cho các trang tĩnh (chính sách, hỗ trợ...). Server Component.
export function SideNav({
  title,
  items,
  activeHref,
}: {
  title: string;
  items: { label: string; href: string }[];
  activeHref: string;
}) {
  return (
    <nav className="rounded-2xl border border-line bg-white p-3">
      <p className="px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-muted">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-[13.5px] transition ${
                  active
                    ? "bg-green-tint font-semibold text-green-d"
                    : "text-ink-2 hover:bg-bg hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
