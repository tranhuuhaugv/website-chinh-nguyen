"use client";

import Link from "next/link";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import {
  BoxIcon,
  CartIcon,
  FileTextIcon,
  GridIcon,
} from "@/components/icons";
import { ALL_PRODUCTS, BLOG_POSTS, CATEGORIES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const STATS = [
  {
    label: "Sản phẩm",
    value: ALL_PRODUCTS.length,
    icon: BoxIcon,
    href: "/admin/san-pham",
    grad: "from-[#3B82F6] to-[#2563EB]",
    ring: "hover:border-[#3B82F6]",
  },
  {
    label: "Danh mục",
    value: CATEGORIES.length,
    icon: GridIcon,
    href: "/admin/danh-muc",
    grad: "from-[#8B5CF6] to-[#7C3AED]",
    ring: "hover:border-[#8B5CF6]",
  },
  {
    label: "Bài viết",
    value: BLOG_POSTS.length,
    icon: FileTextIcon,
    href: "/admin/blog",
    grad: "from-[#F59E0B] to-[#D97706]",
    ring: "hover:border-[#F59E0B]",
  },
  {
    label: "Đơn hàng",
    value: 0,
    icon: CartIcon,
    href: "/admin/don-hang",
    grad: "from-[#159A48] to-[#0B5E2C]",
    ring: "hover:border-green",
  },
];

const recentColumns: Column<Product>[] = [
  { key: "name", label: "Tên sản phẩm", render: (p) => <span className="font-medium">{p.name}</span> },
  { key: "brand", label: "Hãng" },
  { key: "price", label: "Giá", render: (p) => formatPrice(p.price) },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Tổng quan</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, href, grad, ring }) => (
          <Link
            key={label}
            href={href}
            className={`group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${ring}`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${grad}`}
            >
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <p className="mt-3 text-[28px] font-extrabold text-ink">{value}</p>
            <p className="text-[13px] text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <AdminTable
        title="Sản phẩm mới nhất"
        columns={recentColumns}
        rows={ALL_PRODUCTS.slice(0, 5)}
        rowId={(p) => p.id}
        editHref={(p) => `/admin/san-pham/${p.id}`}
      />
    </div>
  );
}
