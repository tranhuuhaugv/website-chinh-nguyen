import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { SITE } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, MapPinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description:
    "Cơ hội nghề nghiệp tại Laptop Chính Nguyễn — môi trường trẻ trung, thu nhập hấp dẫn, lộ trình phát triển rõ ràng.",
};

const BENEFITS = [
  "Thu nhập cạnh tranh: lương cứng + thưởng doanh số + phụ cấp.",
  "Môi trường trẻ trung, năng động, tôn trọng cá nhân.",
  "Đào tạo bài bản về sản phẩm và kỹ năng bán hàng.",
  "Lộ trình thăng tiến rõ ràng: nhân viên → quản lý.",
  "Ưu đãi mua sản phẩm nội bộ giá đặc biệt.",
  "Đóng BHXH, BHYT, BHTN đầy đủ theo quy định.",
  "Thưởng lễ, Tết, sinh nhật; du lịch team building.",
  "Xét tăng lương định kỳ theo năng lực.",
];

const JOBS = [
  {
    title: "Nhân viên tư vấn bán hàng",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "8 - 15 triệu",
    desc: "Tư vấn, giới thiệu sản phẩm và chốt đơn cho khách tại cửa hàng và online.",
    requirements: [
      "Giao tiếp tốt, nhanh nhẹn, cầu tiến.",
      "Ưu tiên có kinh nghiệm bán hàng công nghệ.",
      "Trung thực, chịu khó, yêu thích công nghệ.",
    ],
  },
  {
    title: "Kỹ thuật viên laptop",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "9 - 14 triệu",
    desc: "Kiểm tra, cài đặt, vệ sinh, sửa chữa và bảo hành laptop cho khách hàng.",
    requirements: [
      "Trung cấp/cao đẳng CNTT hoặc tương đương.",
      "Kinh nghiệm sửa phần cứng/phần mềm là lợi thế.",
      "Cẩn thận, trách nhiệm, ham học hỏi.",
    ],
  },
  {
    title: "Nhân viên Marketing",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "10 - 18 triệu",
    desc: "Lên kế hoạch và triển khai nội dung, quảng cáo, chăm sóc kênh mạng xã hội.",
    requirements: [
      "Kinh nghiệm chạy quảng cáo Facebook/Google.",
      "Biết dựng ảnh/video cơ bản là lợi thế.",
      "Tư duy tốt, chủ động, bắt trend nhanh.",
    ],
  },
  {
    title: "Nhân viên kho - giao hàng",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "7 - 10 triệu",
    desc: "Quản lý, sắp xếp hàng hóa trong kho và giao hàng đến khách trong khu vực.",
    requirements: [
      "Sức khỏe tốt, có xe máy và điện thoại.",
      "Thật thà, cẩn thận, đúng giờ.",
      "Thông thạo đường sá Đà Nẵng là lợi thế.",
    ],
  },
];

const PROCESS = [
  "Gửi CV qua email hoặc nộp trực tiếp tại cửa hàng.",
  "Nhân sự sàng lọc và hẹn phỏng vấn trong 3 - 5 ngày.",
  "Phỏng vấn trực tiếp với quản lý bộ phận.",
  "Thông báo kết quả, mời nhận việc và đào tạo hội nhập.",
];

export default function CareersPage() {
  return (
    <StaticPage
      title="Gia nhập đội ngũ Chính Nguyễn"
      lead="Cùng nhau phát triển trong một môi trường trẻ trung, chuyên nghiệp và nhiều cơ hội thăng tiến."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Tuyển dụng" }]}
      hero={
        <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
          <p className="text-[34px] font-extrabold text-green">{JOBS.length}</p>
          <p className="text-[12.5px] text-muted">vị trí đang tuyển</p>
        </div>
      }
    >
      {/* Môi trường làm việc */}
      <Band tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionIntro eyebrow="Văn hóa" title="Môi trường làm việc" />
          <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-ink-2">
            <p>
              Tại Chính Nguyễn, con người là tài sản quý giá nhất. Chúng tôi xây
              dựng môi trường cởi mở, nơi mỗi thành viên được lắng nghe, được đào
              tạo và có cơ hội phát triển mỗi ngày.
            </p>
            <p>
              Dù bạn là người mới hay đã có kinh nghiệm, chúng tôi luôn tạo điều
              kiện để bạn học hỏi, thể hiện năng lực và cùng nhau xây dựng một hệ
              thống bán lẻ công nghệ uy tín.
            </p>
          </div>
        </div>
      </Band>

      {/* Quyền lợi */}
      <Band tone="tint">
        <SectionIntro center eyebrow="Quyền lợi" title="Điều bạn nhận được" />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <p className="text-[14.5px] leading-relaxed text-ink-2">{b}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Vị trí đang tuyển */}
      <Band tone="white">
        <SectionIntro center eyebrow="Cơ hội" title="Vị trí đang tuyển" />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {JOBS.map((job) => (
            <div
              key={job.title}
              className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <h3 className="text-[16.5px] font-bold text-ink">{job.title}</h3>
              <div className="mt-2 flex flex-wrap gap-3 text-[12.5px] text-muted">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {job.location}
                </span>
                <span>· {job.type}</span>
                <span className="font-semibold text-green-d">{job.salary}</span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
                {job.desc}
              </p>
              <ul className="mt-3 flex flex-1 flex-col gap-1.5">
                {job.requirements.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-[13px] text-ink-2"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                    {r}
                  </li>
                ))}
              </ul>
              <Link
                href="/lien-he"
                className="mt-5 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-green-d to-green text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(11,94,44,.25)] transition hover:shadow-[0_6px_16px_rgba(11,94,44,.38)]"
              >
                Ứng tuyển ngay
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Band>

      {/* Quy trình ứng tuyển */}
      <Band tone="tint">
        <SectionIntro center eyebrow="Cách ứng tuyển" title="Quy trình 4 bước" />
        <div className="mt-11 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <div key={step}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-[18px] font-extrabold text-white shadow-[0_8px_18px_rgba(11,94,44,0.28)]">
                {i + 1}
              </span>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
                {step}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-[14px] text-ink-2">
          Gửi CV về{" "}
          <b className="text-green-d">tuyendung@laptopchinhnguyen.vn</b> hoặc gọi{" "}
          <b className="text-green-d">{SITE.hotline}</b>.
        </p>
      </Band>
    </StaticPage>
  );
}
