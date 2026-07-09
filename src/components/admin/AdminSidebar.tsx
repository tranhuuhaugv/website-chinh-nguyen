"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CartIcon,
  FileTextIcon,
  GridIcon,
  LayoutIcon,
  TagIcon,
} from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutIcon, exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: BoxIcon },
  { href: "/admin/danh-muc", label: "Danh mục", icon: GridIcon },
  { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: TagIcon },
  { href: "/admin/blog", label: "Blog", icon: FileTextIcon },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: CartIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-white lg:block">
      <div className="flex h-16 items-center border-b border-line px-5 text-[18px] font-bold text-green">
        Chính <span className="text-green-dd">&nbsp;Nguyễn</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition ${
                active
                  ? "bg-green text-white"
                  : "text-ink-2 hover:bg-bg hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
