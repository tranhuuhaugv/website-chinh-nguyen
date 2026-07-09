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
    title: "Bảo hành 24 tháng",
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
              className="flex items-center gap-3 rounded-[10px] border border-line bg-white px-4 py-3.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-green-soft text-green">
                <Icon className="h-[21px] w-[21px]" />
              </span>
              <div>
                <b className="block text-sm font-semibold">{title}</b>
                <span className="text-[12.5px] text-muted">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
