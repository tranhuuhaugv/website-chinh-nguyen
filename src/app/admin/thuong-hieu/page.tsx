import { BrandAdminTable } from "@/components/admin/BrandAdminTable";
import { getAdminBrands } from "@/lib/data";

export const metadata = { title: "Thương hiệu" };
export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();
  return <BrandAdminTable brands={brands} />;
}
