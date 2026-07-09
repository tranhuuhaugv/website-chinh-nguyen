import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { BLOG_POSTS } from "@/lib/mock-data";

export const metadata = { title: "Blog" };

const TAG_OPTIONS = ["Tư vấn", "Thủ thuật", "So sánh", "Đánh giá"].map((t) => ({
  value: t,
  label: t,
}));

const FIELDS: AdminField[] = [
  { name: "image", label: "Ảnh bìa bài viết", type: "image" },
  { name: "title", label: "Tiêu đề", full: true, placeholder: "Tiêu đề bài viết" },
  { name: "slug", label: "Slug (URL)", placeholder: "tieu-de-bai-viet" },
  { name: "tag", label: "Chuyên mục", type: "select", options: TAG_OPTIONS },
  { name: "excerpt", label: "Mô tả ngắn", type: "textarea", placeholder: "Tóm tắt bài viết..." },
  { name: "content", label: "Nội dung (đoạn văn + chèn ảnh)", type: "blocks" },
];

export default function AdminBlogFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  const post = isNew ? undefined : BLOG_POSTS.find((p) => p.slug === params.id);

  const initialValues: Record<string, string> = post
    ? {
        title: post.title,
        slug: post.slug,
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content.join("\n\n"),
      }
    : {};

  return (
    <AdminForm
      title={isNew ? "Thêm bài viết" : "Sửa bài viết"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Đăng bài" : "Lưu thay đổi"}
      backHref="/admin/blog"
    />
  );
}
