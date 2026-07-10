import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import {
  CheckIcon,
  InstallmentIcon,
  ShieldIcon,
  TruckIcon,
  WarrantyIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Laptop Chính Nguyễn — hệ thống laptop chính hãng tại Đà Nẵng, cam kết giá tốt, bảo hành uy tín, dịch vụ tận tâm.",
};

const STATS = [
  ["5.000+", "Khách hàng tin tưởng"],
  ["100%", "Hàng chính hãng"],
  ["24 tháng", "Bảo hành tiêu chuẩn"],
  ["2 giờ", "Giao nhanh nội thành"],
];

const VALUES = [
  {
    icon: ShieldIcon,
    title: "Chính hãng 100%",
    desc: "Nguyên seal, đầy đủ hóa đơn VAT, nguồn gốc minh bạch.",
  },
  {
    icon: WarrantyIcon,
    title: "Hậu mãi uy tín",
    desc: "Bảo hành 24 tháng, 1 đổi 1 trong 30 ngày, hỗ trợ trọn đời.",
  },
  {
    icon: InstallmentIcon,
    title: "Giá tốt, trả góp 0%",
    desc: "Cam kết giá cạnh tranh, trả góp linh hoạt, duyệt nhanh.",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Giao 2h nội thành, 1-3 ngày toàn quốc, kiểm tra khi nhận.",
  },
];

const COMMITMENTS = [
  "Tư vấn trung thực, đúng nhu cầu — không bán sản phẩm khách không cần.",
  "Niêm yết giá rõ ràng, không phát sinh chi phí ẩn.",
  "Kiểm tra kỹ sản phẩm trước khi giao đến tay khách hàng.",
  "Hỗ trợ kỹ thuật, vệ sinh máy, cài phần mềm miễn phí trọn đời.",
  "Lắng nghe và phản hồi mọi góp ý trong vòng 24 giờ.",
];

const MILESTONES = [
  ["2019", "Thành lập cửa hàng đầu tiên tại quận Hải Châu, Đà Nẵng."],
  ["2021", "Mở rộng hệ thống, hợp tác nhiều thương hiệu lớn."],
  ["2023", "Ra mắt trả góp 0% và giao nhanh 2 giờ nội thành."],
  ["2026", "Phục vụ hơn 5.000 khách, phát triển kênh mua sắm online."],
];

export default function AboutPage() {
  return (
    <StaticPage
      title="Chính hãng — Giá tốt — Tận tâm"
      lead="Laptop Chính Nguyễn là hệ thống chuyên laptop chính hãng tại Đà Nẵng, đồng hành cùng bạn từ lúc chọn máy đến suốt quá trình sử dụng."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
      hero={
        <div className="flex gap-4">
          {STATS.slice(0, 2).map(([num, label]) => (
            <div
              key={label}
              className="w-[140px] rounded-2xl border border-line bg-white p-5 text-center shadow-card"
            >
              <p className="text-[26px] font-extrabold text-green">{num}</p>
              <p className="mt-1 text-[12px] leading-tight text-muted">{label}</p>
            </div>
          ))}
        </div>
      }
    >
      {/* Câu chuyện */}
      <Band tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionIntro
            eyebrow="Câu chuyện"
            title="Hành trình của Chính Nguyễn"
          />
          <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-ink-2">
            <p>
              Ra đời năm 2019, Chính Nguyễn xuất phát từ mong muốn mang laptop
              chính hãng đến người dùng Đà Nẵng với mức giá hợp lý nhất. Với chúng
              tôi, một chiếc laptop không chỉ là công cụ — mà là người bạn đồng
              hành trong học tập, công việc và sáng tạo.
            </p>
            <p>
              Từ một cửa hàng nhỏ, bằng sự tận tâm và uy tín, chúng tôi dần trở
              thành địa chỉ tin cậy của hàng nghìn khách hàng. Chúng tôi không
              chạy theo số lượng, mà đặt chất lượng và trải nghiệm khách hàng lên
              hàng đầu.
            </p>
            <p className="rounded-2xl border-l-[3px] border-green bg-green-tint px-5 py-4 text-[15px] font-medium text-ink">
              “Mỗi sản phẩm bán ra đều được kiểm tra kỹ, đầy đủ giấy tờ và bảo
              hành minh bạch — để bạn luôn an tâm.”
            </p>
          </div>
        </div>
      </Band>

      {/* Con số */}
      <Band tone="green">
        <SectionIntro
          center
          invert
          eyebrow="Những con số biết nói"
          title="Được khách hàng tin tưởng lựa chọn"
        />
        <div className="mt-10 grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {STATS.map(([num, label]) => (
            <div key={label}>
              <p className="text-[40px] font-extrabold leading-none max-[600px]:text-[30px]">
                {num}
              </p>
              <p className="mt-2 text-[13.5px] text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Giá trị cốt lõi */}
      <Band tone="tint">
        <SectionIntro
          center
          eyebrow="Giá trị cốt lõi"
          title="Điều làm nên Chính Nguyễn"
        />
        <div className="mt-11 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_12px_26px_rgba(21,154,72,0.30)]">
                <Icon className="h-8 w-8" />
              </span>
              <h3 className="text-[15.5px] font-bold text-ink">{title}</h3>
              <p className="mx-auto mt-2 max-w-[230px] text-[13.5px] leading-relaxed text-ink-2">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* Tầm nhìn & Sứ mệnh */}
      <Band tone="white">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border-l-[3px] border-green pl-6">
            <p className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-green-d">
              Tầm nhìn
            </p>
            <p className="text-[17px] font-semibold leading-relaxed text-ink">
              Trở thành hệ thống bán lẻ laptop uy tín hàng đầu miền Trung, nơi
              khách hàng luôn an tâm về chất lượng và dịch vụ.
            </p>
          </div>
          <div className="border-l-[3px] border-green pl-6">
            <p className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-green-d">
              Sứ mệnh
            </p>
            <p className="text-[17px] font-semibold leading-relaxed text-ink">
              Mang công nghệ chính hãng đến gần hơn với mọi người bằng sản phẩm
              chất lượng, giá hợp lý và sự phục vụ tận tâm.
            </p>
          </div>
        </div>
      </Band>

      {/* Cam kết */}
      <Band tone="tint">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionIntro
            eyebrow="Cam kết"
            title="Những gì chúng tôi hứa với bạn"
          />
          <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {COMMITMENTS.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-2"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Cột mốc */}
      <Band tone="white">
        <SectionIntro
          center
          eyebrow="Chặng đường"
          title="Cột mốc phát triển"
        />
        <div className="mt-11 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map(([year, text]) => (
            <div key={year} className="relative pt-6">
              <span className="absolute left-0 top-0 h-[3px] w-10 rounded-full bg-gradient-to-r from-green to-green-dd" />
              <p className="text-[28px] font-extrabold text-green">{year}</p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Band>
    </StaticPage>
  );
}
