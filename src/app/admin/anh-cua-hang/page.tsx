import { AboutPhotosManager } from "@/components/admin/AboutPhotosManager";
import { getAboutPhotos } from "@/lib/data";

export const metadata = { title: "Ảnh cửa hàng" };
export const dynamic = "force-dynamic";

export default async function AdminAboutPhotosPage() {
  const photos = await getAboutPhotos();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[20px] font-bold text-ink">
          Ảnh không gian cửa hàng
        </h1>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Ảnh hiển thị ở khối “Không gian &amp; hoạt động tại cửa hàng” trên trang
          Giới thiệu.
        </p>
      </div>

      <AboutPhotosManager initial={photos} />
    </div>
  );
}
