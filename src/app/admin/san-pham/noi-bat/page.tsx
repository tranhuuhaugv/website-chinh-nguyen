import Link from "next/link";
import { FeaturedOrder } from "@/components/admin/FeaturedOrder";
import { getAdminFeatured } from "@/lib/data";

export const metadata = { title: "Sắp xếp sản phẩm nổi bật" };
export const dynamic = "force-dynamic";

export default async function FeaturedOrderPage() {
  const items = await getAdminFeatured();
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div>
        <Link
          href="/admin/san-pham"
          className="text-[13px] text-muted transition hover:text-green-d"
        >
          ← Quay lại danh sách sản phẩm
        </Link>
        <h1 className="mt-2 text-[20px] font-bold text-ink">
          Sắp xếp sản phẩm nổi bật
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Thứ tự ở đây = thứ tự hiện ở khối “Sản phẩm nổi bật” trên trang chủ
          (từ trên xuống = từ trái sang phải). Bấm ↑ ↓ để đổi chỗ, xong bấm{" "}
          <b>Lưu thứ tự</b>. Muốn thêm/bớt máy: tích “Nổi bật” ở danh sách sản
          phẩm.
        </p>
      </div>
      <FeaturedOrder initial={items} />
    </div>
  );
}
