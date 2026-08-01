import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import { getBrandSeriesOptions, getNeeds } from "@/lib/data";

export const metadata = { title: "Thêm sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const [brandSeries, needs] = await Promise.all([
    getBrandSeriesOptions(),
    getNeeds(),
  ]);

  return (
    <AdminForm
      title="Thêm sản phẩm"
      singleColumn
      fields={productFields(brandSeries, needs)}
      initialValues={{
        brandSeries: brandSeries[0]?.value ?? "",
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
