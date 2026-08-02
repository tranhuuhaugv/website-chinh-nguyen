import { StoresManager } from "@/components/admin/StoresManager";
import { getStores } from "@/lib/data";

export const metadata = { title: "Cửa hàng" };
export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const stores = await getStores();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[20px] font-bold text-ink">Hệ thống cửa hàng</h1>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Thêm / sửa / xoá cửa hàng. Thay đổi áp dụng ngay cho Footer, trang Hệ
          thống cửa hàng, Liên hệ và trang chi tiết sản phẩm.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <StoresManager initial={stores} />
      </section>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Mẹo: “Thành phố” dùng cho dữ liệu SEO (schema.org) — nhập đúng “Đà Nẵng”
        hoặc “Hội An” để Google hiểu vị trí từng cơ sở.
      </p>
    </div>
  );
}
