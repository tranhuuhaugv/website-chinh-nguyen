import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import { getAdminBrands, getSeriesCategories } from "@/lib/data";

export const metadata = { title: "Thêm sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const [brands, series] = await Promise.all([
    getAdminBrands(),
    getSeriesCategories(),
  ]);
  const names = brands.map((b) => b.name);
  const seriesOptions = series.map((s) => ({ value: s.slug, label: s.name }));

  return (
    <AdminForm
      title="Thêm sản phẩm"
      singleColumn
      fields={productFields(names, seriesOptions)}
      initialValues={{
        brand: names[0] ?? "Dell",
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
