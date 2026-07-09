import { notFound } from "next/navigation";
import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getStaticPage } from "@/lib/mock-data";

export const metadata = { title: "Trang nội dung" };

const FIELDS: AdminField[] = [
  { name: "title", label: "Tiêu đề trang", full: true },
  { name: "lead", label: "Mô tả ngắn (dưới tiêu đề)", type: "textarea" },
  { name: "content", label: "Nội dung (đoạn văn + chèn ảnh)", type: "blocks" },
];

export default function AdminStaticPageFormPage({
  params,
}: {
  params: { id: string };
}) {
  const page = getStaticPage(params.id);
  if (!page) notFound();

  return (
    <AdminForm
      title={`Chỉnh sửa: ${page.title}`}
      fields={FIELDS}
      initialValues={{ title: page.title }}
      submitLabel="Lưu thay đổi"
      backHref="/admin/trang-tinh"
    />
  );
}
