import Image from "next/image";
import type { CustomerPhoto } from "@/lib/types";
import { Container } from "./Container";
import { ImageIcon } from "./icons";

// Lưới ảnh khách hàng & hoạt động cửa hàng (3 cột). Server Component.
// Ảnh thật dùng next/image; chưa có thì hiện ô placeholder.

function PhotoCard({ photo, index }: { photo: CustomerPhoto; index: number }) {
  return (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white shadow-card">
      {photo.image ? (
        <Image
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 50vw, 380px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EEF1ED] to-[#E3E7E2] text-muted">
          <ImageIcon className="h-8 w-8 opacity-50" />
          <span className="text-[11.5px]">Ảnh khách hàng {index + 1}</span>
        </div>
      )}
    </figure>
  );
}

export function CustomerGallery({ photos }: { photos: CustomerPhoto[] }) {
  // Lưới gọn 3×3 — lấy tối đa 9 ảnh cho cân đối.
  const shown = photos.slice(0, 9);

  return (
    <section className="py-[18px]">
      <Container>
        {/* Tiêu đề kiểu "tab underline": gạch xanh dưới chữ + line xám kéo hết hàng */}
        <div className="mb-5 flex items-end border-b border-line">
          <h2 className="-mb-px border-b-[3px] border-green pb-2 text-[15px] font-bold uppercase tracking-wide text-ink max-[520px]:text-[13.5px]">
            Hình ảnh khách hàng &amp; hoạt động của chúng tôi
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-2 max-[640px]:gap-2.5">
          {shown.map((photo, i) => (
            <PhotoCard key={`${photo.id}-${i}`} photo={photo} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
