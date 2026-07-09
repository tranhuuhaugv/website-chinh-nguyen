import Image from "next/image";
import type { CustomerPhoto } from "@/lib/types";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { ImageIcon } from "./icons";

// Dải ảnh khách hàng tự chạy ngang liên tục (marquee). Server Component
// (animation bằng CSS). Ảnh thật dùng next/image; chưa có thì hiện ô placeholder.

function PhotoCard({ photo, index }: { photo: CustomerPhoto; index: number }) {
  return (
    <figure className="relative aspect-[4/3] w-[240px] shrink-0 overflow-hidden rounded-xl border border-line bg-white max-[520px]:w-[190px]">
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
          <span className="text-[11.5px]">Ảnh khách hàng {index + 1}</span>
        </div>
      )}
    </figure>
  );
}

export function CustomerGallery({ photos }: { photos: CustomerPhoto[] }) {
  // Nhân đôi danh sách để vòng lặp marquee liền mạch.
  const loop = [...photos, ...photos];

  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead title="Khách hàng của Chính Nguyễn" />
        <p className="-mt-2 mb-4 text-[13.5px] text-ink-2">
          Cảm ơn hàng nghìn khách hàng đã tin tưởng và lựa chọn.
        </p>

        <div className="cn-marquee-wrap overflow-hidden">
          <div className="cn-marquee flex w-max gap-3">
            {loop.map((photo, i) => (
              <PhotoCard
                key={`${photo.id}-${i}`}
                photo={photo}
                index={i % photos.length}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 h-[3px] w-full rounded bg-green" />
      </Container>
    </section>
  );
}
