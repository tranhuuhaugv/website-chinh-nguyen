"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { ALL_PRODUCTS } from "@/lib/mock-data";

interface BrandRow {
  name: string;
  count: number;
}

// Gộp số sản phẩm theo hãng (mock). Khi có DB: brand là bảng riêng, CRUD như trên.
function getBrandRows(): BrandRow[] {
  const map = new Map<string, number>();
  for (const p of ALL_PRODUCTS) {
    map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

const columns: Column<BrandRow>[] = [
  {
    key: "name",
    label: "Thương hiệu",
    render: (b) => <span className="font-medium">{b.name}</span>,
  },
  { key: "count", label: "Số sản phẩm", render: (b) => `${b.count} sản phẩm` },
];

export default function AdminBrandsPage() {
  return (
    <AdminTable
      title="Quản lý thương hiệu"
      columns={columns}
      rows={getBrandRows()}
      rowId={(b) => b.name}
      searchKeys={(b) => b.name}
    />
  );
}
