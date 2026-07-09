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
  { label: "Sản phẩm", value: ALL_PRODUCTS.length, icon: BoxIcon, href: "/admin/san-pham" },
  { label: "Danh mục", value: CATEGORIES.length, icon: GridIcon, href: "/admin/danh-muc" },
  { label: "Bài viết", value: BLOG_POSTS.length, icon: FileTextIcon, href: "/admin/blog" },
  { label: "Đơn hàng", value: 0, icon: CartIcon, href: "/admin/don-hang" },
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
        {STATS.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-line bg-white p-5 transition hover:border-green"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[26px] font-extrabold text-ink">{value}</p>
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
