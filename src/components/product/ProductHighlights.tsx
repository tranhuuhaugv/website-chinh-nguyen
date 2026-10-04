import type { ComponentType, SVGProps } from "react";
import type { Product } from "@/lib/types";
import {
  CheckIcon,
  CpuIcon,
  GiftIcon,
  GpuIcon,
  MonitorIcon,
  RamIcon,
  StorageIcon,
} from "@/components/icons";

// Khối nhấn mạnh ở trang chi tiết (Server Component, không state):
//  - KeySpecs: lưới "Thông số nổi bật" dưới ảnh (CPU / RAM / Ổ cứng / Màn hình hoặc Card).
//  - PromoBox: hộp "Ưu đãi" có tiêu đề nền xanh + danh sách tick.

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export function KeySpecs({ product }: { product: Product }) {
  const tiles: { icon: Icon; label: string; value?: string }[] = [
    { icon: CpuIcon, label: "CPU", value: product.cpu },
    { icon: RamIcon, label: "RAM", value: product.ram },
    { icon: StorageIcon, label: "Ổ cứng", value: product.storage },
    product.gpu
      ? { icon: GpuIcon, label: "Card đồ họa", value: product.gpu }
      : { icon: MonitorIcon, label: "Màn hình", value: product.screen },
  ];
  const shown = tiles.filter((t) => t.value?.trim());
  if (shown.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-ink">Thông số nổi bật</h2>
        <a
          href="#thong-so"
          className="text-[12.5px] font-medium text-green-d hover:underline"
        >
          Xem tất cả thông số
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {shown.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            // Số ô lẻ -> ô cuối dàn hết hàng cho khỏi hụt 1 góc.
            className={`flex items-center gap-2.5 rounded-xl bg-[#F4F8F5] p-2.5 ${
              shown.length % 2 === 1 && i === shown.length - 1 ? "col-span-2" : ""
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green shadow-sm">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {label}
              </p>
              <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PromoBox({ gift }: { gift?: string }) {
  const rows: React.ReactNode[] = [];
  if (gift) {
    rows.push(
      <>
        Tặng <b className="text-ink">{gift}</b> khi mua trong hôm nay.
      </>,
    );
  }
  rows.push(
    <>
      Bảo hành <b className="text-ink">12 tháng</b> + kiểm tra máy trực tiếp khi
      nhận.
    </>,
    <>
      <b className="text-ink">Dùng thử 15 ngày</b>, không hài lòng được hỗ trợ
      đổi trả.
    </>,
    <>
      <b className="text-ink">Miễn phí</b> cài đặt phần mềm &amp; vệ sinh máy.
    </>,
  );

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#BFE0CB] bg-white">
      <div className="flex items-center gap-2 bg-gradient-to-r from-green-d to-green px-4 py-2.5 text-white">
        <GiftIcon className="h-[18px] w-[18px]" />
        <p className="text-[13.5px] font-bold">Ưu đãi tại Chính Nguyễn</p>
      </div>
      <ul className="flex flex-col gap-2.5 p-4 text-[13px] leading-snug text-ink-2">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
              <CheckIcon className="h-[11px] w-[11px]" />
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
