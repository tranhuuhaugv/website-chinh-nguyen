import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import {
  getAdminProductById,
  getBrandSeriesOptions,
  getNeeds,
} from "@/lib/data";
import { toRichHtml } from "@/lib/rich-text";

export const metadata = { title: "Sửa sản phẩm" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, brandSeries, needs] = await Promise.all([
    getAdminProductById(params.id),
    getBrandSeriesOptions(),
    getNeeds(),
  ]);
  if (!product) notFound();

  const s = (v: unknown) => (v == null ? "" : String(v));
  // Giá trị ô gộp = "TênHãng||slug-dòng" (khớp option đã dựng).
  const brandSeriesValue = `${product.brandName}||${s(product.series)}`;

  return (
    <AdminForm
      title={`Sửa: ${product.name}`}
      singleColumn
      fields={productFields(brandSeries, needs)}
      initialValues={{
        name: product.name,
        brandSeries: brandSeriesValue,
        condition: product.condition === "new" ? "new" : "used",
        price: s(product.price),
        oldPrice: s(product.oldPrice),
        cpu: product.cpu,
        ram: product.ram,
        storage: product.storage,
        capacity: s(product.capacity),
        color: s(product.color),
        gpu: s(product.gpu),
        mux: s(product.mux),
        webcam: s(product.webcam),
        screen: s(product.screen),
        resolution: s(product.resolution),
        refresh: s(product.refresh),
        os: s(product.os),
        battery: s(product.battery),
        weight: s(product.weight),
        ports: s(product.ports),
        warranty: s(product.warranty),
        needs: (product.needs ?? []).join(","),
        images: (product.images ?? []).join(","),
        // Hiện lại dạng link cho dễ đọc/sửa (lưu trong DB là slug).
        variantLinks: (product.variantSlugs ?? [])
          .map((s) => `/san-pham/${s}`)
          .join("\n"),
        // Mô tả nay lưu dạng HTML (CKEditor). Đổi cả dữ liệu cũ (mảng khối) lẫn
        // mới (chuỗi HTML) về HTML để editor hiện lại đúng nội dung + ảnh đã đăng.
        description: toRichHtml(product.description, "h3"),
        gift: s(product.gift),
        badge: s(product.badge),
        accent: s(product.accent) || "dark",
        isNew: product.isNew ? "co" : "khong",
        isFeatured: product.isFeatured ? "co" : "khong",
        isFlashSale: product.isFlashSale ? "co" : "khong",
        installmentPerMonth: s(product.installmentPerMonth),
        sort: s(product.sort),
        slug: product.slug,
        metaTitle: s(product.metaTitle),
        metaDescription: s(product.metaDescription),
      }}
      submitLabel="Lưu thay đổi"
      backHref="/admin/san-pham"
      endpoint="/api/admin/products"
      method="PUT"
      extra={{ id: product.id }}
    />
  );
}
