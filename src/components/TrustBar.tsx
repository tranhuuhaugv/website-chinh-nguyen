import type { ComponentType, SVGProps } from "react";
import { Container } from "./Container";
import {
  InstallmentIcon,
  ShieldIcon,
  TruckIcon,
  WarrantyIcon,
} from "./icons";

// Dải cam kết dịch vụ (4 mục). Server Component.

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const ITEMS: { icon: IconType; title: string; desc: string }[] = [
  { icon: ShieldIcon, title: "100% chính hãng", desc: "Nguyên seal, đủ VAT" },
  { icon: TruckIcon, title: "Giao nhanh 2h", desc: "Nội thành miễn phí" },
  {
    icon: WarrantyIcon,
    title: "Dùng thử 15 ngày",
    desc: "1 đổi 1 trong 30 ngày",
  },
  { icon: InstallmentIcon, title: "Trả góp 0%", desc: "Duyệt trong 15 phút" },
];

export function TrustBar() {
  return (
    <section className="py-[18px]">
      <Container>
        <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3.5 rounded-2xl border border-line bg-white px-4 py-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-[#C9E4D2] hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(11,94,44,0.28)]">
                <Icon className="h-[22px] w-[22px]" />
              </span>
              <div>
                <b className="block text-sm font-bold text-ink">{title}</b>
                <span className="text-[12.5px] text-muted">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
