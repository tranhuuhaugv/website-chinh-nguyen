import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { CATEGORIES } from "@/lib/mock-data";

export const metadata = { title: "Danh mục" };

const ICON_OPTIONS = [
  "office",
  "gaming",
  "graphic",
  "slim",
  "student",
  "macbook",
  "ai",
  "used",
  "dell",
  "asus",
  "acer",
  "lenovo",
  "hp",
  "msi",
  "monitor",
  "accessory",
].map((v) => ({ value: v, label: v }));

const FIELDS: AdminField[] = [
  { name: "name", label: "Tên danh mục", placeholder: "VD: Laptop Gaming" },
  { name: "slug", label: "Slug (URL)", placeholder: "laptop-gaming" },
  { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { name: "tag", label: "Nhãn (tuỳ chọn)", placeholder: "Hot / Giá tốt" },
];

export default function AdminCategoryFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  const category = isNew
    ? undefined
    : CATEGORIES.find((c) => c.slug === params.id);

  const initialValues: Record<string, string> = category
    ? {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        tag: category.tag ?? "",
      }
    : {};

  return (
    <AdminForm
      title={isNew ? "Thêm danh mục" : "Sửa danh mục"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Tạo danh mục" : "Lưu thay đổi"}
      backHref="/admin/danh-muc"
    />
  );
}
