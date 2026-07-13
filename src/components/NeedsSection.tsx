import Link from "next/link";
import { Container } from "./Container";
import { ProductImage } from "./ProductImage";
import type { ProductAccent } from "@/lib/types";

// "Nhu cầu sử dụng" — thẻ nền pastel + hình laptop, bấm để lọc theo nhu cầu.

const NEEDS: {
  label: string;
  need: string;
  bg: string;
  accent: ProductAccent;
}[] = [
  { label: "Gaming", need: "gaming", bg: "bg-[#FDE7EA]", accent: "red" },
  { label: "Đồ họa - Máy trạm", need: "do-hoa", bg: "bg-[#FBF0D9]", accent: "dark" },
  { label: "Văn phòng", need: "van-phong", bg: "bg-[#D9EEF7]", accent: "blue" },
  { label: "Mỏng nhẹ", need: "mong-nhe", bg: "bg-[#EBE4F7]", accent: "silver" },
  { label: "Doanh nhân", need: "doanh-nhan", bg: "bg-[#DCF3E4]", accent: "crimson" },
];

export function NeedsSection() {
  return (
    <section className="py-6">
      <Container>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-[20px] font-bold text-ink">Nhu cầu sử dụng</h2>
          <div className="mt-5 grid grid-cols-5 gap-3 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2 sm:gap-4">
            {NEEDS.map((n) => (
              <Link
                key={n.need}
                href={`/san-pham?nhucau=${n.need}`}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded-2xl ${n.bg} p-4 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-card-hover`}
                >
                  <div className="h-full w-full overflow-hidden rounded-xl">
                    <ProductImage accent={n.accent} uid={`need-${n.need}`} />
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-ink transition group-hover:text-green-d">
                  {n.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
