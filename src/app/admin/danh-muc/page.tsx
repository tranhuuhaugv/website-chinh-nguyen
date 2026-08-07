import { CategoryAdminTable } from "@/components/admin/CategoryAdminTable";
import { getAdminProducts, getCategories, getCategoryCounts } from "@/lib/data";

export const metadata = { title: "Danh mục" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, counts, products] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getAdminProducts(),
  ]);
  return (
    <CategoryAdminTable
      categories={categories}
      counts={counts}
      products={products}
    />
  );
}
