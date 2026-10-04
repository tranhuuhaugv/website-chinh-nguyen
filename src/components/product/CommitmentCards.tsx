import {
  InstallmentIcon,
  ShieldIcon,
  TruckIcon,
  WarrantyIcon,
} from "@/components/icons";

// Lưới thẻ cam kết (2×2) — tiêu đề đậm + mô tả ngắn. Đổi nội dung theo tình trạng máy.

const NEW = [
  {
    icon: ShieldIcon,
    title: "Chính hãng, nguyên seal",
    desc: "Đầy đủ hộp, phụ kiện & hóa đơn VAT",
  },
  {
    icon: WarrantyIcon,
    title: "Bảo hành 12 tháng",
    desc: "Dùng thử 15 ngày, 1 đổi 1",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Nội thành 2h · toàn quốc 1-3 ngày",
  },
  {
    icon: InstallmentIcon,
    title: "Hỗ trợ trả góp",
    desc: "Qua thẻ tín dụng / công ty tài chính",
  },
];

const USED = [
  {
    icon: ShieldIcon,
    title: "Đã kiểm tra kỹ",
    desc: "Test đầy đủ chức năng, pin, bàn phím, màn hình",
  },
  {
    icon: WarrantyIcon,
    title: "Bảo hành 12 tháng",
    desc: "Dùng thử 15 ngày, 1 đổi 1",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Nội thành 2h · toàn quốc 1-3 ngày, kiểm tra khi nhận",
  },
  {
    icon: InstallmentIcon,
    title: "Hỗ trợ trả góp · thu cũ",
    desc: "Thu cũ đổi mới lên đời, trợ giá tốt",
  },
];

// Mỗi thẻ 1 tông màu icon riêng cho sinh động nhưng vẫn hài hoà với nền xanh của web.
const TONES = [
  "from-[#E3F5EA] to-[#C9EBD6] text-green-d",
  "from-[#E4F0FB] to-[#CFE4F7] text-[#1D6FE0]",
  "from-[#FFF1D9] to-[#FFE2B0] text-[#C2570C]",
  "from-[#F1E8FB] to-[#E3D3F6] text-[#7C3AED]",
];

export function CommitmentCards({ condition }: { condition?: string }) {
  const items = condition === "new" ? NEW : USED;
  return (
    <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
      {items.map(({ icon: Icon, title, desc }, i) => (
        <div
          key={title}
          className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,20,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#BFE0CB] hover:shadow-card"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${TONES[i % TONES.length]} transition group-hover:scale-105`}
          >
            <Icon className="h-[22px] w-[22px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold leading-tight text-ink">
              {title}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
