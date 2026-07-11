import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getCategories } from "@/lib/data";

export const metadata = { title: "Danh mục" };
export const dynamic = "force-dynamic";

const ICON_OPTIONS = [
  "office", "gaming", "graphic", "slim", "student", "macbook", "ai", "used",
  "dell", "asus", "acer", "lenovo", "hp", "msi", "monitor", "accessory",
].map((v) => ({ value: v, label: v }));

const GROUP_OPTIONS = [
  { value: "", label: "— Không nhóm —" },
  { value: "nhu-cau", label: "Theo nhu cầu" },
  { value: "thuong-hieu", label: "Theo thương hiệu" },
  { value: "khac", label: "Khác" },
];

const FIELDS: AdminField[] = [
  { name: "image", label: "Ảnh danh mục (tuỳ chọn)", type: "image" },
  { name: "name", label: "Tên danh mục", placeholder: "VD: Laptop Gaming" },
  { name: "slug", label: "Slug (URL) — để trống sẽ tự tạo", placeholder: "laptop-gaming" },
  { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { name: "group", label: "Nhóm (mega-menu)", type: "select", options: GROUP_OPTIONS },
  { name: "tag", label: "Nhãn (tuỳ chọn)", placeholder: "Hot / Giá tốt" },
];

export default async function AdminCategoryFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  const category = isNew
    ? undefined
    : (await getCategories()).find((c) => c.slug === params.id);

  const initialValues: Record<string, string> = category
    ? {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        tag: category.tag ?? "",
        image: category.image ?? "",
      }
    : {};

  return (
    <AdminForm
      title={isNew ? "Thêm danh mục" : "Sửa danh mục"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Tạo danh mục" : "Lưu thay đổi"}
      backHref="/admin/danh-muc"
      endpoint="/api/admin/categories"
      method={isNew ? "POST" : "PUT"}
      extra={isNew ? undefined : { originalSlug: params.id }}
    />
  );
}
