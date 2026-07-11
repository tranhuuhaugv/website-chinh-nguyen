import { CustomerPhotosManager } from "@/components/admin/CustomerPhotosManager";
import { getCustomerPhotoUrls } from "@/lib/data";

export const metadata = { title: "Ảnh khách hàng" };
export const dynamic = "force-dynamic";

export default async function AdminCustomerPhotosPage() {
  const images = await getCustomerPhotoUrls();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Ảnh khách hàng (trang chủ)</h1>
      <CustomerPhotosManager initial={images} />
    </div>
  );
}
