import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getPostBySlug } from "@/lib/data";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

const TAG_OPTIONS = ["Tư vấn", "Thủ thuật", "So sánh", "Đánh giá"].map((t) => ({
  value: t,
  label: t,
}));

const FIELDS: AdminField[] = [
  { name: "image", label: "Ảnh bìa (banner) bài viết", type: "image" },
  { name: "title", label: "Tiêu đề", full: true, placeholder: "Tiêu đề bài viết" },
  {
    name: "slug",
    label: "Slug (URL) — để trống sẽ tự tạo từ tiêu đề",
    placeholder: "tieu-de-bai-viet",
  },
  { name: "tag", label: "Chuyên mục", type: "select", options: TAG_OPTIONS },
  { name: "excerpt", label: "Mô tả ngắn", type: "textarea", placeholder: "Tóm tắt bài viết..." },
  { name: "content", label: "Nội dung (đoạn văn + tiêu đề + chèn ảnh)", type: "blocks" },
];

export default async function AdminBlogFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  const post = isNew ? null : await getPostBySlug(params.id);

  const initialValues: Record<string, string> = post
    ? {
        title: post.title,
        slug: post.slug,
        tag: post.tag,
        excerpt: post.excerpt,
        image: post.image ?? "",
        content: JSON.stringify(post.content),
      }
    : {};

  return (
    <AdminForm
      title={isNew ? "Thêm bài viết" : "Sửa bài viết"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Đăng bài" : "Lưu thay đổi"}
      backHref="/admin/blog"
      endpoint="/api/admin/blog"
      method={isNew ? "POST" : "PUT"}
      extra={isNew ? undefined : { originalSlug: params.id }}
    />
  );
}
