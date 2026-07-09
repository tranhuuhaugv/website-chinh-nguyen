"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { ALL_PRODUCTS } from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const columns: Column<Product>[] = [
  {
    key: "name",
    label: "Tên sản phẩm",
    render: (p) => <span className="font-medium">{p.name}</span>,
  },
  { key: "brand", label: "Hãng" },
  { key: "price", label: "Giá bán", render: (p) => formatPrice(p.price) },
  {
    key: "rating",
    label: "Đánh giá",
    render: (p) => `${p.rating.toFixed(1)} ★ (${p.reviewCount})`,
  },
];

export default function AdminProductsPage() {
  return (
    <AdminTable
      title="Quản lý sản phẩm"
      columns={columns}
      rows={ALL_PRODUCTS}
      rowId={(p) => p.id}
      searchKeys={(p) => `${p.name} ${p.brand}`}
      editHref={(p) => `/admin/san-pham/${p.id}`}
      addHref="/admin/san-pham/them"
      addLabel="Thêm sản phẩm"
    />
  );
}
