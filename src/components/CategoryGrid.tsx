import Image from "next/image";
import Link from "next/link";
import type { Category, CategoryIconName } from "@/lib/types";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { CategoryIcon, CheckIcon } from "./icons";

// Lưới "Danh mục nổi bật" (8 cột → 4 → 3). Mỗi danh mục 1 ô gradient màu riêng
// + icon trắng cho nổi bật, hiện đại. Có ảnh thật thì hiển thị ảnh thay ô icon.

// Màu gradient cho từng danh mục (class literal để Tailwind quét được).
const CAT_COLOR: Record<CategoryIconName, string> = {
  office: "from-[#3B82F6] to-[#2563EB]",
  gaming: "from-[#EF4444] to-[#DC2626]",
  graphic: "from-[#8B5CF6] to-[#7C3AED]",
  slim: "from-[#14B8A6] to-[#0D9488]",
  student: "from-[#22C55E] to-[#16A34A]",
  macbook: "from-[#64748B] to-[#475569]",
  ai: "from-[#06B6D4] to-[#0891B2]",
  used: "from-[#F59E0B] to-[#D97706]",
  dell: "from-[#2563EB] to-[#1D4ED8]",
  asus: "from-[#6366F1] to-[#4F46E5]",
  acer: "from-[#10B981] to-[#059669]",
  lenovo: "from-[#F43F5E] to-[#E11D48]",
  hp: "from-[#0EA5E9] to-[#0284C7]",
  msi: "from-[#B91C1C] to-[#7F1D1D]",
  monitor: "from-[#475569] to-[#334155]",
  accessory: "from-[#FB923C] to-[#EA580C]",
  pc: "from-[#0F766E] to-[#115E59]",
  new: "from-[#16A34A] to-[#15803D]",
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead
          title="Danh mục nổi bật"
          subtitle="Chọn nhanh theo nhu cầu và thương hiệu bạn cần"
        />
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card max-[520px]:p-4">
          <div className="grid grid-cols-8 gap-x-1.5 gap-y-2.5 max-[900px]:grid-cols-4 max-[520px]:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative rounded-xl px-1.5 py-3 text-center transition hover:bg-green-tint"
              >
                {cat.tag && (
                  <span className="absolute left-1/2 top-1 z-[2] flex -translate-x-1/2 items-center gap-[3px] whitespace-nowrap rounded-full bg-sale px-[7px] py-0.5 text-[10px] font-semibold text-white">
                    <CheckIcon className="h-[9px] w-[9px]" />
                    {cat.tag}
                  </span>
                )}

                {cat.image ? (
                  <span className="relative mx-auto mb-2.5 block h-[72px] w-[72px] overflow-hidden rounded-2xl transition group-hover:-translate-y-[3px] max-[520px]:h-[60px] max-[520px]:w-[60px]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className={`mx-auto mb-2.5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_6px_14px_rgba(0,0,0,0.12)] transition group-hover:-translate-y-[3px] max-[520px]:h-[60px] max-[520px]:w-[60px] ${CAT_COLOR[cat.icon]}`}
                  >
                    <CategoryIcon name={cat.icon} className="h-8 w-8" />
                  </span>
                )}

                <b className="block text-[13px] font-medium leading-[1.35] text-ink">
                  {cat.name}
                </b>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
