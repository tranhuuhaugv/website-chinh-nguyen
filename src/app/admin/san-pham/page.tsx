import { ProductAdminList } from "@/components/admin/ProductAdminList";
import { getAdminProducts, getSeriesCategories } from "@/lib/data";

export const metadata = { title: "Sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, series] = await Promise.all([
    getAdminProducts(),
    getSeriesCategories(),
  ]);
  return <ProductAdminList products={products} seriesList={series} />;
}
