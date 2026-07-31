import { CategoryAdminTable } from "@/components/admin/CategoryAdminTable";
import { getCategories, getCategoryCounts } from "@/lib/data";

export const metadata = { title: "Danh mục" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);
  return <CategoryAdminTable categories={categories} counts={counts} />;
}
