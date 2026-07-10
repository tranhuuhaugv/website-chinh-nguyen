import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
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
    desc: "Sản phẩm nguyên seal, đầy đủ hóa đơn VAT, nguồn gốc rõ ràng, minh bạch.",
  },
  {
    icon: WarrantyIcon,
    title: "Hậu mãi uy tín",
    desc: "Bảo hành 24 tháng, 1 đổi 1 trong 30 ngày, hỗ trợ kỹ thuật trọn đời.",
  },
  {
    icon: InstallmentIcon,
    title: "Giá tốt, trả góp 0%",
    desc: "Cam kết giá cạnh tranh nhất, hỗ trợ trả góp linh hoạt, duyệt nhanh.",
  },
  {
    icon: TruckIcon,
    title: "Giao nhanh tận nơi",
    desc: "Giao 2h nội thành Đà Nẵng, 1-3 ngày toàn quốc, kiểm tra khi nhận.",
  },
];

const COMMITMENTS = [
  "Tư vấn trung thực, đúng nhu cầu — không bán sản phẩm khách hàng không cần.",
  "Niêm yết giá rõ ràng, không phát sinh chi phí ẩn.",
  "Sản phẩm được kiểm tra kỹ trước khi giao đến tay khách hàng.",
  "Hỗ trợ kỹ thuật, vệ sinh máy và cài đặt phần mềm miễn phí trọn đời.",
  "Luôn lắng nghe và phản hồi mọi góp ý của khách hàng trong 24 giờ.",
];

const MILESTONES = [
  ["2019", "Thành lập cửa hàng đầu tiên tại quận Hải Châu, Đà Nẵng."],
  ["2021", "Mở rộng hệ thống, trở thành đối tác của nhiều thương hiệu lớn."],
  ["2023", "Ra mắt dịch vụ trả góp 0% và giao nhanh 2 giờ nội thành."],
  ["2026", "Phục vụ hơn 5.000 khách hàng, phát triển kênh mua sắm trực tuyến."],
];

export default function AboutPage() {
  return (
    <StaticPage
      title="Về Laptop Chính Nguyễn"
      lead="Hệ thống chuyên laptop chính hãng tại Đà Nẵng — nơi bạn tìm thấy sản phẩm phù hợp với mức giá tốt và dịch vụ đáng tin cậy."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Câu chuyện */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-3 text-[18px] font-bold text-ink">
            Câu chuyện của chúng tôi
          </h2>
          <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-ink-2">
            <p>
              Laptop Chính Nguyễn ra đời từ năm 2019, xuất phát từ mong muốn mang
              đến cho người dùng Đà Nẵng và cả nước những chiếc laptop chính hãng
              với mức giá hợp lý nhất. Chúng tôi hiểu rằng một chiếc laptop không
              chỉ là công cụ, mà còn là người bạn đồng hành trong học tập, công
              việc và cả những đam mê sáng tạo.
            </p>
            <p>
              Bắt đầu từ một cửa hàng nhỏ, bằng sự tận tâm và uy tín, Chính Nguyễn
              dần trở thành địa chỉ tin cậy của hàng nghìn khách hàng. Chúng tôi
              không chạy theo số lượng, mà đặt chất lượng sản phẩm và trải nghiệm
              khách hàng lên hàng đầu — từ khâu tư vấn, kiểm tra máy, đến chế độ
              hậu mãi lâu dài.
            </p>
            <p>
              Với phương châm{" "}
              <b className="text-ink">“Chính hãng — Giá tốt — Tận tâm”</b>, mỗi
              sản phẩm bán ra đều được kiểm tra kỹ lưỡng, đầy đủ giấy tờ và chế độ
              bảo hành minh bạch. Đội ngũ của chúng tôi luôn sẵn sàng giúp bạn
              chọn đúng chiếc máy phù hợp với nhu cầu và ngân sách.
            </p>
          </div>
        </section>

        {/* Tầm nhìn & Sứ mệnh */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h3 className="mb-2 text-[16px] font-bold text-green-d">Tầm nhìn</h3>
            <p className="text-[14px] leading-relaxed text-ink-2">
              Trở thành hệ thống bán lẻ laptop uy tín hàng đầu khu vực miền Trung,
              nơi khách hàng luôn an tâm về chất lượng sản phẩm và dịch vụ.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h3 className="mb-2 text-[16px] font-bold text-green-d">Sứ mệnh</h3>
            <p className="text-[14px] leading-relaxed text-ink-2">
              Mang công nghệ chính hãng đến gần hơn với mọi người thông qua sản
              phẩm chất lượng, giá hợp lý và sự phục vụ tận tâm nhất.
            </p>
          </div>
        </section>

        {/* Thống kê */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(([num, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-gradient-to-br from-green-d to-green-dd p-5 text-center text-white shadow-[0_10px_26px_rgba(11,94,44,0.22)]"
            >
              <p className="text-[26px] font-extrabold">{num}</p>
              <p className="mt-1 text-[12.5px] text-white/85">{label}</p>
            </div>
          ))}
        </section>

        {/* Giá trị cốt lõi */}
        <section>
          <h2 className="mb-4 text-[18px] font-bold text-ink">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-[#C9E4D2] hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(21,154,72,0.28)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <b className="text-[14.5px] text-ink">{title}</b>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cam kết */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Cam kết với khách hàng
          </h2>
          <ul className="flex flex-col gap-3">
            {COMMITMENTS.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-2"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Cột mốc */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Cột mốc phát triển
          </h2>
          <ol className="relative flex flex-col gap-5 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:w-px before:bg-line">
            {MILESTONES.map(([year, text]) => (
              <li key={year} className="relative flex gap-4">
                <span className="relative z-[1] flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-[12.5px] font-bold text-white shadow-[0_6px_14px_rgba(21,154,72,0.28)]">
                  {year}
                </span>
                <p className="self-center text-[14px] leading-relaxed text-ink-2">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </StaticPage>
  );
}
