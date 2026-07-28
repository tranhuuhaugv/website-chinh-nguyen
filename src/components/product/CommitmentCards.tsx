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
    title: "Bảo hành 24 tháng",
    desc: "Dùng thử 15 ngày · 1 đổi 1 trong 30 ngày",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Nội thành 2h · toàn quốc 1-3 ngày",
  },
  {
    icon: InstallmentIcon,
    title: "Trả góp 0% lãi suất",
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
    title: "Bảo hành tại shop",
    desc: "Dùng thử 15 ngày · 1 đổi 1 trong 30 ngày",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Nội thành 2h · toàn quốc 1-3 ngày, kiểm tra khi nhận",
  },
  {
    icon: InstallmentIcon,
    title: "Trả góp 0% · thu cũ",
    desc: "Thu cũ đổi mới lên đời, trợ giá đến 3.000.000₫",
  },
];

export function CommitmentCards({ condition }: { condition?: string }) {
  const items = condition === "new" ? NEW : USED;
  return (
    <div className="grid grid-cols-2 gap-2 max-[420px]:grid-cols-1">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex gap-2 rounded-lg border border-line bg-white p-2.5 transition hover:border-[#C9E4D2]"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green-soft text-green">
            <Icon className="h-[14px] w-[14px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold leading-tight text-ink">{title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
