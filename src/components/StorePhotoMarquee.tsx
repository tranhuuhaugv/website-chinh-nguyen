import Image from "next/image";
import type { CustomerPhoto } from "@/lib/types";
import { Container } from "./Container";

// Dải ảnh "Không gian & hoạt động cửa hàng" chạy ngang liên tục (marquee).
// Đặt trong Footer -> hiện ở MỌI trang. Hover để tạm dừng. Dùng .cn-marquee
// (globals.css) + tôn trọng prefers-reduced-motion. Chỉ hiện khi có ảnh THẬT.

export function StorePhotoMarquee({ photos }: { photos: CustomerPhoto[] }) {
  const real = photos.filter((p) => p.image);
  if (real.length === 0) return null;

  // Nhân đôi danh sách để cuộn vòng lặp mượt (translateX -50% = đúng 1 vòng).
  const loop = [...real, ...real];

  return (
    <section className="border-b border-white/10 pb-8 pt-2">
      <Container>
        <h3 className="mb-4 text-center text-[12.5px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Không gian &amp; hoạt động tại cửa hàng
        </h3>
      </Container>

      <div className="cn-marquee-wrap relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
        <div className="cn-marquee flex w-max">
          {loop.map((p, i) => (
            <figure
              key={`${p.id}-${i}`}
              className="group relative mr-3 h-28 w-40 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:h-32 sm:w-48"
            >
              <Image
                src={p.image as string}
                alt={p.alt}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
