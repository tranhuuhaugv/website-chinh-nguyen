import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import {
  getBrandSeriesOptions,
  getNeeds,
  getProductCategoryOptions,
} from "@/lib/data";

export const metadata = { title: "Thêm sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const [brandSeries, needs, productCategories] = await Promise.all([
    getBrandSeriesOptions(),
    getNeeds(),
    getProductCategoryOptions(),
  ]);

  return (
    <AdminForm
      title="Thêm sản phẩm"
      singleColumn
      fields={productFields(brandSeries, needs, productCategories)}
      initialValues={{
        brandSeries: brandSeries[0]?.value ?? "",
        condition: "used",
        accent: "dark",
        category: "",
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
