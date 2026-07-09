"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { STATIC_PAGES, type StaticPageInfo } from "@/lib/mock-data";

const columns: Column<StaticPageInfo>[] = [
  {
    key: "title",
    label: "Tên trang",
    render: (p) => <span className="font-medium">{p.title}</span>,
  },
  {
    key: "path",
    label: "Đường dẫn",
    render: (p) => <code className="text-muted">{p.path}</code>,
  },
];

export default function AdminStaticPagesPage() {
  return (
    <AdminTable
      title="Trang nội dung"
      columns={columns}
      rows={STATIC_PAGES}
      rowId={(p) => p.id}
      searchKeys={(p) => p.title}
      editHref={(p) => `/admin/trang-tinh/${p.id}`}
    />
  );
}
