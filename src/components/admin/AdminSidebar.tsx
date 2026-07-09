"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CartIcon,
  FileTextIcon,
  GridIcon,
  ImageIcon,
  LayoutIcon,
  SettingsIcon,
  TagIcon,
} from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutIcon, exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: BoxIcon },
  { href: "/admin/danh-muc", label: "Danh mục", icon: GridIcon },
  { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: TagIcon },
  { href: "/admin/blog", label: "Blog", icon: FileTextIcon },
  { href: "/admin/banner", label: "Banner", icon: ImageIcon },
  { href: "/admin/trang-tinh", label: "Trang nội dung", icon: LayoutIcon },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: CartIcon },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:block">
      <div className="flex h-16 items-center gap-2 bg-gradient-to-r from-green-dd via-green-d to-green px-5 text-[17px] font-bold text-white">
        Chính Nguyễn
        <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          Admin
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition ${
                active
                  ? "bg-gradient-to-r from-green-d to-green text-white shadow-[0_6px_16px_rgba(21,154,72,0.3)]"
                  : "text-ink-2 hover:bg-bg"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  active ? "bg-white/20 text-white" : "bg-bg text-green-d"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
