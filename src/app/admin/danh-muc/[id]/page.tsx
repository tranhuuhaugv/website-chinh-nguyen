import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getCategoryEdit } from "@/lib/data";

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
  { value: "dong-may", label: "Dòng máy (SP gắn dòng này sẽ hiện ở đây)" },
  { value: "khac", label: "Khác" },
];

const FIELDS: AdminField[] = [
  {
    name: "image",
    label: "Ảnh đại diện (thẻ danh mục ở trang chủ / menu — tuỳ chọn)",
    type: "image",
  },
  {
    name: "coverImage",
    label: "Ảnh bìa trang danh mục (ảnh NGANG, hiện ở đầu trang — tuỳ chọn)",
    type: "image",
  },
  { name: "name", label: "Tên danh mục", placeholder: "VD: Laptop Gaming" },
  {
    name: "slug",
    label: "Slug (URL) — để trống sẽ tự tạo",
    placeholder: "laptop-gaming",
    generateFrom: "name",
  },
  { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { name: "group", label: "Nhóm (mega-menu)", type: "select", options: GROUP_OPTIONS },
  { name: "tag", label: "Nhãn (tuỳ chọn)", placeholder: "Hot / Giá tốt" },
  {
    name: "sort",
    label: "STT — thứ tự hiển thị ngoài trang chủ (số nhỏ lên trước)",
    type: "number",
    placeholder: "VD: 1, 2, 3...",
  },

  { name: "hSeo", label: "Nội dung SEO (hiện dưới danh sách sản phẩm)", type: "heading" },
  { name: "metaDescription", label: "Meta description (mô tả ngắn cho Google)", type: "textarea" },
  {
    name: "seoContent",
    label: "Bài viết SEO — chèn từ khoá cần lên top",
    type: "blocks",
    full: true,
  },
];

export default async function AdminCategoryFormPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { parent?: string; brand?: string; icon?: string };
}) {
  const isNew = params.id === "them";
  const category = isNew ? null : await getCategoryEdit(params.id);

  // "Thêm dòng máy con" từ cây danh mục: prefill nhóm = dòng máy, tên có sẵn
  // tiền tố hãng (slug tự thành "dell-xps"...), icon theo hãng.
  const addingChild = isNew && !!searchParams.parent;
  const brandName = searchParams.brand?.trim();

  const initialValues: Record<string, string> = category
    ? {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        group: category.group ?? "",
        tag: category.tag ?? "",
        image: category.image ?? "",
        coverImage: category.coverImage ?? "",
        sort: String(category.sort ?? ""),
        metaDescription: category.metaDescription ?? "",
        seoContent: category.seoContent ?? "",
      }
    : addingChild
      ? {
          name: brandName ? `${brandName} ` : "",
          group: "dong-may",
          icon: searchParams.icon ?? "office",
        }
      : {};

  return (
    <AdminForm
      title={
        addingChild
          ? `Thêm dòng máy${brandName ? ` cho ${brandName}` : ""}`
          : isNew
            ? "Thêm danh mục"
            : "Sửa danh mục"
      }
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
