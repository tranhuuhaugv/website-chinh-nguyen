import { AdminForm, type AdminField } from "@/components/admin/AdminForm";
import { getProductBySlug, ALL_PRODUCTS } from "@/lib/mock-data";

export const metadata = { title: "Sản phẩm" };

const BRAND_OPTIONS = [
  "Dell",
  "Asus",
  "Acer",
  "Lenovo",
  "HP",
  "MacBook",
  "MSI",
].map((b) => ({ value: b, label: b }));

const FIELDS: AdminField[] = [
  { name: "image", label: "Ảnh sản phẩm", type: "image" },
  { name: "name", label: "Tên sản phẩm", full: true, placeholder: "VD: Dell XPS 13 Plus 9320 i7" },
  { name: "brand", label: "Thương hiệu", type: "select", options: BRAND_OPTIONS },
  { name: "price", label: "Giá bán (VND)", type: "number", placeholder: "28990000" },
  { name: "oldPrice", label: "Giá gốc (VND)", type: "number", placeholder: "34990000" },
  { name: "cpu", label: "CPU", placeholder: "i7-1360P" },
  { name: "ram", label: "RAM", placeholder: "16GB" },
  { name: "storage", label: "Ổ cứng / Card", placeholder: "512GB" },
  { name: "badge", label: "Nhãn giảm giá", placeholder: "-18%" },
  { name: "gift", label: "Quà tặng kèm", full: true, placeholder: "Tặng balo + chuột" },
];

export default function AdminProductFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "them";
  // Tìm theo id (mock). Khi có DB: prisma.product.findUnique.
  const product = isNew
    ? undefined
    : ALL_PRODUCTS.find((p) => p.id === params.id) ??
      getProductBySlug(params.id);

  const initialValues: Record<string, string> = product
    ? {
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        oldPrice: product.oldPrice ? String(product.oldPrice) : "",
        cpu: product.cpu,
        ram: product.ram,
        storage: product.storage,
        badge: product.badge ?? "",
        gift: product.gift ?? "",
      }
    : {};

  return (
    <AdminForm
      title={isNew ? "Thêm sản phẩm" : "Sửa sản phẩm"}
      fields={FIELDS}
      initialValues={initialValues}
      submitLabel={isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}
      backHref="/admin/san-pham"
    />
  );
}
