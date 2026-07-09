"use client";

import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { BLOG_POSTS } from "@/lib/mock-data";
import type { BlogPost } from "@/lib/types";

const columns: Column<BlogPost>[] = [
  {
    key: "title",
    label: "Tiêu đề",
    render: (b) => <span className="font-medium">{b.title}</span>,
  },
  { key: "tag", label: "Chuyên mục" },
  { key: "date", label: "Ngày đăng" },
];

export default function AdminBlogPage() {
  return (
    <AdminTable
      title="Quản lý bài viết"
      columns={columns}
      rows={BLOG_POSTS}
      rowId={(b) => b.slug}
      searchKeys={(b) => b.title}
      editHref={(b) => `/admin/blog/${b.slug}`}
      addHref="/admin/blog/them"
      addLabel="Thêm bài viết"
    />
  );
}
