import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import { getBrandSeriesOptions, getNeeds } from "@/lib/data";

export const metadata = { title: "Thêm sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AddProductPage({
  searchParams,
}: {
  searchParams: { brand?: string; series?: string };
}) {
  const [brandSeries, needs] = await Promise.all([
    getBrandSeriesOptions(),
    getNeeds(),
  ]);

  // Thêm từ 1 dòng máy/hãng cụ thể -> mặc định luôn vào đúng danh mục đó.
  const brand = searchParams.brand?.trim() ?? "";
  const series = searchParams.series?.trim() ?? "";
  const prefillBS = brand
    ? `${brand}||${series}`
    : (brandSeries[0]?.value ?? "");

  return (
    <AdminForm
      title="Thêm sản phẩm"
      singleColumn
      fields={productFields(brandSeries, needs)}
      initialValues={{
        brandSeries: prefillBS,
        condition: "used",
        accent: "dark",
        isNew: "khong",
        isFlashSale: "khong",
        sort: "0",
      }}
      submitLabel="Thêm sản phẩm"
      backHref="/admin/san-pham"
      endpoint="/api/admin/products"
      method="POST"
    />
  );
}
