import Image from "next/image";
import type { CustomerPhoto } from "@/lib/types";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { ImageIcon } from "./icons";

// Dải ảnh khách hàng thực tế tại cửa hàng (dưới "Sản phẩm nổi bật").
// Server Component. Ảnh thật dùng next/image; chưa có thì hiện ô placeholder.

export function CustomerGallery({ photos }: { photos: CustomerPhoto[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead title="Khách hàng của Chính Nguyễn" />
        <p className="-mt-2 mb-4 text-[13.5px] text-ink-2">
          Cảm ơn hàng nghìn khách hàng đã tin tưởng và lựa chọn.
        </p>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {photos.map((photo) => (
            <figure
              key={photo.id}
              className="relative aspect-[4/3] w-[240px] shrink-0 overflow-hidden rounded-xl border border-line bg-white max-[520px]:w-[180px]"
            >
              {photo.image ? (
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EEF1ED] to-[#E3E7E2] text-muted">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                  <span className="text-[11.5px]">Ảnh khách hàng</span>
                </div>
              )}
            </figure>
          ))}
        </div>

        {/* Đường kẻ xanh nhấn (như ảnh mẫu) */}
        <div className="mt-3 h-[3px] w-full rounded bg-green" />
      </Container>
    </section>
  );
}
