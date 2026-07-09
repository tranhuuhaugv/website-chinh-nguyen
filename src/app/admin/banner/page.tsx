import { ImageUpload } from "@/components/admin/ImageUpload";

export const metadata = { title: "Banner" };

const HERO_SLOTS = [
  "Banner chính - Slide 1",
  "Banner chính - Slide 2",
  "Banner chính - Slide 3",
];

const SIDE_SLOTS = ["Banner treo bên trái", "Banner treo bên phải"];

export default function AdminBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Quản lý banner</h1>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Banner chính (slide trang chủ)
        </h2>
        <p className="mb-5 text-[13px] text-muted">
          Tỉ lệ khuyến nghị: ngang (khoảng 1200×380).
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HERO_SLOTS.map((label) => (
            <div key={label}>
              <p className="mb-2 text-[13px] font-medium text-ink">{label}</p>
              <ImageUpload ratio="aspect-[1200/380]" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 text-[15px] font-bold text-ink">Banner treo 2 bên</h2>
        <p className="mb-5 text-[13px] text-muted">
          Tỉ lệ khuyến nghị: dọc (khoảng 150×430).
        </p>
        <div className="grid grid-cols-2 gap-6 sm:max-w-md">
          {SIDE_SLOTS.map((label) => (
            <div key={label}>
              <p className="mb-2 text-[13px] font-medium text-ink">{label}</p>
              <ImageUpload ratio="aspect-[150/430]" />
            </div>
          ))}
        </div>
      </section>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Lưu ý: cần cấu hình Cloudinary để lưu ảnh thật và áp dụng lên trang chủ
        (hiện các banner đang dùng ảnh minh hoạ). Khi có database, ảnh tải lên sẽ
        được gán vào banner tương ứng.
      </p>
    </div>
  );
}
