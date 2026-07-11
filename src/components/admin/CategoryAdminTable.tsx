"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import type { Category } from "@/lib/types";

const columns: Column<Category>[] = [
  {
    key: "name",
    label: "Tên danh mục",
    render: (c) => <span className="font-medium">{c.name}</span>,
  },
  {
    key: "slug",
    label: "Slug",
    render: (c) => <code className="text-muted">/{c.slug}</code>,
  },
  { key: "tag", label: "Nhãn", render: (c) => c.tag ?? "—" },
];

export function CategoryAdminTable({ categories }: { categories: Category[] }) {
  return (
    <AdminTable
      title="Quản lý danh mục"
      columns={columns}
      rows={categories}
      rowId={(c) => c.slug}
      searchKeys={(c) => c.name}
      editHref={(c) => `/admin/danh-muc/${c.slug}`}
      addHref="/admin/danh-muc/them"
      addLabel="Thêm danh mục"
      deleteEndpoint={(c) =>
        `/api/admin/categories?slug=${encodeURIComponent(c.slug)}`
      }
    />
  );
}
