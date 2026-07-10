"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import type { BlogPost } from "@/lib/types";

// Bảng quản lý bài viết (client) — cột có render JSX nên tách khỏi trang server.

const columns: Column<BlogPost>[] = [
  {
    key: "title",
    label: "Tiêu đề",
    render: (b) => <span className="font-medium">{b.title}</span>,
  },
  { key: "tag", label: "Chuyên mục" },
  { key: "date", label: "Ngày đăng" },
];

export function BlogAdminTable({ posts }: { posts: BlogPost[] }) {
  return (
    <AdminTable
      title="Quản lý bài viết"
      columns={columns}
      rows={posts}
      rowId={(b) => b.slug}
      searchKeys={(b) => b.title}
      editHref={(b) => `/admin/blog/${b.slug}`}
      addHref="/admin/blog/them"
      addLabel="Thêm bài viết"
      deleteEndpoint={(b) => `/api/admin/blog?slug=${encodeURIComponent(b.slug)}`}
    />
  );
}
