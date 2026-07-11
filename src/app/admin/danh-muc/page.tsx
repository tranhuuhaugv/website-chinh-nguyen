import { CategoryAdminTable } from "@/components/admin/CategoryAdminTable";
import { getCategories } from "@/lib/data";

export const metadata = { title: "Danh mục" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoryAdminTable categories={categories} />;
}
