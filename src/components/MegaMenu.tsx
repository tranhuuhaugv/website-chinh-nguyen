import Link from "next/link";
import { ChevronDownIcon, GridIcon } from "./icons";

// Mega-menu "Danh mục" ở header (chỉ desktop, mở khi rê chuột — CSS thuần, không JS).
// Nội dung cố định theo nhóm; mobile dùng thanh điều hướng đáy nên ẩn menu này.

const BRANDS = [
  { label: "Dell", href: "/danh-muc/dell" },
  { label: "HP", href: "/danh-muc/hp" },
  { label: "Lenovo", href: "/danh-muc/lenovo" },
  { label: "Asus", href: "/danh-muc/asus" },
  { label: "Acer", href: "/danh-muc/acer" },
  { label: "MSI", href: "/danh-muc/msi" },
  { label: "MacBook", href: "/danh-muc/macbook" },
];
const NEEDS = [
  { label: "Laptop Gaming", href: "/danh-muc/laptop-gaming" },
  { label: "Máy trạm - Đồ họa", href: "/danh-muc/laptop-do-hoa" },
  { label: "Văn phòng", href: "/danh-muc/laptop-van-phong" },
];
const OTHER = [
  { label: "Laptop mới", href: "/danh-muc/laptop-moi" },
  { label: "Laptop cũ", href: "/danh-muc/laptop-cu" },
  { label: "PC đồng bộ", href: "/danh-muc/pc" },
  { label: "Màn hình", href: "/danh-muc/man-hinh" },
  { label: "Phụ kiện", href: "/danh-muc/phu-kien" },
];

function Col({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-muted">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="block rounded-lg px-2 py-1.5 text-[13.5px] text-ink-2 transition hover:bg-green-tint hover:text-green-d"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MegaMenu() {
  return (
    <div className="group relative hidden shrink-0 lg:block">
      <button
        type="button"
        className="flex h-10 items-center gap-1.5 rounded-lg bg-green-soft px-3.5 text-[13.5px] font-semibold text-green-d transition group-hover:bg-green group-hover:text-white"
      >
        <GridIcon className="h-[18px] w-[18px]" />
        Danh mục
        <ChevronDownIcon className="h-4 w-4 transition group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-[520px] translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="grid grid-cols-3 gap-5 rounded-2xl border border-line bg-white p-5 shadow-pop">
          <Col title="Thương hiệu" items={BRANDS} />
          <Col title="Nhu cầu" items={NEEDS} />
          <Col title="Loại máy & khác" items={OTHER} />
        </div>
      </div>
    </div>
  );
}
