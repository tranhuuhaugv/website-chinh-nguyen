import { ProductAdminList } from "@/components/admin/ProductAdminList";
import { getAdminProducts } from "@/lib/data";

export const metadata = { title: "Sản phẩm" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <ProductAdminList products={products} />;
}
