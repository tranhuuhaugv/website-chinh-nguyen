"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CartIcon,
  CloseIcon,
  CpuIcon,
  FileTextIcon,
  GridIcon,
  ImageIcon,
  LayoutIcon,
  MapPinIcon,
  MenuIcon,
  SettingsIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";

// Menu admin chia theo NHÓM CÔNG VIỆC (việc làm hằng ngày lên trên). Dùng chung
// cho sidebar desktop + ngăn kéo (drawer) trên mobile.

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutIcon;
  exact?: boolean;
};

const GROUPS: { title?: string; items: NavItem[] }[] = [
  {
    items: [{ href: "/admin", label: "Tổng quan", icon: LayoutIcon, exact: true }],
  },
  {
    title: "Bán hàng",
    items: [
      { href: "/admin/don-hang", label: "Đơn hàng", icon: CartIcon },
      { href: "/admin/khach-hang", label: "Khách hàng", icon: UsersIcon },
      { href: "/admin/san-pham", label: "Sản phẩm", icon: BoxIcon },
      { href: "/admin/build-pc", label: "Build PC", icon: CpuIcon },
      { href: "/admin/danh-muc", label: "Danh mục", icon: GridIcon },
      { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: TagIcon },
    ],
  },
  {
    title: "Nội dung",
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileTextIcon },
      { href: "/admin/banner", label: "Banner", icon: ImageIcon },
      { href: "/admin/trang-tinh", label: "Trang nội dung", icon: LayoutIcon },
      { href: "/admin/anh-khach-hang", label: "Ảnh khách hàng", icon: ImageIcon },
      { href: "/admin/anh-cua-hang", label: "Ảnh cửa hàng", icon: ImageIcon },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/cua-hang", label: "Cửa hàng", icon: MapPinIcon },
      { href: "/admin/quan-tri-vien", label: "Quản trị viên", icon: UserIcon },
      { href: "/admin/cai-dat", label: "Cài đặt", icon: SettingsIcon },
    ],
  },
];

function Brand() {
  return (
    <div className="flex h-16 items-center gap-2 bg-gradient-to-r from-green-dd via-green-d to-green px-5 text-[17px] font-bold text-white">
      Chính Nguyễn
      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
        Admin
      </span>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-4 p-3">
      {GROUPS.map((g, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {g.title && (
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
              {g.title}
            </p>
          )}
          {g.items.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-green-d to-green text-white shadow-[0_6px_16px_rgba(11,94,44,0.3)]"
                    : "text-ink-2 hover:bg-bg"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    active ? "bg-white/20 text-white" : "bg-green-tint text-green-d"
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/** Sidebar cố định bên trái (desktop) — cuộn riêng, không trôi theo nội dung. */
export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-white lg:flex">
      <Brand />
      <NavList />
    </aside>
  );
}

/** Nút ☰ + ngăn kéo menu cho mobile (trước đây admin trên điện thoại không có menu). */
export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-2 transition hover:border-green hover:text-green-d"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="relative">
              <Brand />
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/15"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
