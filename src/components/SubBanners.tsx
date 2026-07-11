import Image from "next/image";
import Link from "next/link";
import type { BannerItem } from "@/lib/types";
import { Container } from "./Container";

// Hàng banner phụ (tối đa 3 ô) ngay dưới banner chính. Mỗi ô là ảnh bấm được.
// Chưa có ảnh nào thì không hiển thị gì.

export function SubBanners({ items }: { items: BannerItem[] }) {
  const list = items.filter((b) => b.image).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="py-3">
      <Container>
        <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1 max-[640px]:gap-3">
          {list.map((b, i) => (
            <Link
              key={i}
              href={b.href}
              aria-label={`Banner ${i + 1}`}
              className="group relative block aspect-[600/200] overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
            >
              <Image
                src={b.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
