import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import { getAdminBrands } from "@/lib/data";

export const metadata = { title: "Thêm sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const brands = await getAdminBrands();
  const names = brands.map((b) => b.name);

  return (
    <AdminForm
      title="Thêm sản phẩm"
      fields={productFields(names)}
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
