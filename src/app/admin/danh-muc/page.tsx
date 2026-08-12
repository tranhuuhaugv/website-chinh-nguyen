import { CategoryAdminTable } from "@/components/admin/CategoryAdminTable";
import {
  getAdminBrands,
  getAdminProducts,
  getCategories,
  getCategoryCounts,
} from "@/lib/data";

export const metadata = { title: "Danh mục" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, counts, products, brands] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getAdminProducts(),
    getAdminBrands(),
  ]);
  return (
    <CategoryAdminTable
      categories={categories}
      counts={counts}
      products={products}
      brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
    />
  );
}
