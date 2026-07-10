import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, MapPinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description:
    "Cơ hội nghề nghiệp tại Laptop Chính Nguyễn — môi trường trẻ trung, thu nhập hấp dẫn, lộ trình phát triển rõ ràng.",
};

const BENEFITS = [
  "Thu nhập cạnh tranh: lương cứng + thưởng doanh số + phụ cấp hấp dẫn.",
  "Môi trường trẻ trung, năng động, thân thiện và tôn trọng cá nhân.",
  "Được đào tạo bài bản về sản phẩm, kỹ năng bán hàng và chăm sóc khách.",
  "Lộ trình thăng tiến rõ ràng: nhân viên → trưởng nhóm → quản lý cửa hàng.",
  "Ưu đãi mua sản phẩm nội bộ với giá đặc biệt.",
  "Đóng BHXH, BHYT, BHTN đầy đủ theo quy định của pháp luật.",
  "Thưởng lễ, Tết, sinh nhật; du lịch và team building hằng năm.",
  "Xét tăng lương định kỳ dựa trên năng lực và hiệu quả công việc.",
];

const JOBS = [
  {
    title: "Nhân viên tư vấn bán hàng",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "8 - 15 triệu",
    desc: "Tư vấn, giới thiệu sản phẩm và chốt đơn hàng cho khách tại cửa hàng và qua kênh online.",
    requirements: [
      "Giao tiếp tốt, nhanh nhẹn, có tinh thần cầu tiến.",
      "Ưu tiên ứng viên có kinh nghiệm bán hàng công nghệ.",
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
      "Tốt nghiệp trung cấp/cao đẳng chuyên ngành CNTT hoặc tương đương.",
      "Có kinh nghiệm sửa chữa phần cứng/phần mềm laptop là lợi thế.",
      "Cẩn thận, trách nhiệm, ham học hỏi.",
    ],
  },
  {
    title: "Nhân viên Marketing",
    type: "Toàn thời gian",
    location: "Đà Nẵng",
    salary: "10 - 18 triệu",
    desc: "Lên kế hoạch và triển khai nội dung, quảng cáo, chăm sóc các kênh mạng xã hội.",
    requirements: [
      "Có kinh nghiệm chạy quảng cáo Facebook/Google, sáng tạo nội dung.",
      "Biết dựng ảnh/video cơ bản là một lợi thế.",
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
      "Sức khỏe tốt, có xe máy và điện thoại thông minh.",
      "Thật thà, cẩn thận, đúng giờ.",
      "Thông thạo đường sá tại Đà Nẵng là lợi thế.",
    ],
  },
];

const PROCESS = [
  "Ứng viên gửi CV qua email hoặc nộp trực tiếp tại cửa hàng.",
  "Bộ phận nhân sự sàng lọc và liên hệ hẹn phỏng vấn trong 3 - 5 ngày.",
  "Phỏng vấn trực tiếp với quản lý bộ phận.",
  "Thông báo kết quả và mời nhận việc, đào tạo hội nhập.",
];

export default function CareersPage() {
  return (
    <StaticPage
      title="Tuyển dụng"
      lead="Gia nhập Laptop Chính Nguyễn — cùng nhau phát triển trong một môi trường trẻ trung, chuyên nghiệp và nhiều cơ hội."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Tuyển dụng" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Môi trường làm việc */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-3 text-[18px] font-bold text-ink">
            Môi trường làm việc
          </h2>
          <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-ink-2">
            <p>
              Tại Chính Nguyễn, chúng tôi tin rằng con người là tài sản quý giá
              nhất. Vì vậy, chúng tôi xây dựng một môi trường làm việc cởi mở,
              nơi mỗi thành viên được lắng nghe, được đào tạo và có cơ hội phát
              triển bản thân mỗi ngày.
            </p>
            <p>
              Dù bạn là người mới hay đã có kinh nghiệm, chúng tôi luôn tạo điều
              kiện để bạn học hỏi, thể hiện năng lực và cùng nhau xây dựng một hệ
              thống bán lẻ công nghệ uy tín.
            </p>
          </div>
        </section>

        {/* Quyền lợi */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Quyền lợi khi gia nhập
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Vị trí đang tuyển */}
        <section>
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Vị trí đang tuyển
          </h2>
          <div className="flex flex-col gap-4">
            {JOBS.map((job) => (
              <div
                key={job.title}
                className="rounded-2xl border border-line bg-white p-5 shadow-card transition duration-200 hover:border-[#C9E4D2] hover:shadow-card-hover"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-bold text-ink">
                      {job.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-[12.5px] text-muted">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span>· {job.type}</span>
                      <span className="font-semibold text-green-d">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/lien-he"
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-green-d to-green px-5 text-[13.5px] font-semibold text-white shadow-[0_4px_12px_rgba(21,154,72,.25)] transition hover:shadow-[0_6px_16px_rgba(21,154,72,.38)]"
                  >
                    Ứng tuyển
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
                  <b className="text-ink">Mô tả:</b> {job.desc}
                </p>
                <div className="mt-2">
                  <p className="mb-1.5 text-[13px] font-semibold text-ink">
                    Yêu cầu:
                  </p>
                  <ul className="flex flex-col gap-1.5">
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
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quy trình ứng tuyển */}
        <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Quy trình ứng tuyển
          </h2>
          <ol className="flex flex-col gap-3">
            {PROCESS.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="self-center text-[14px] text-ink-2">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="rounded-2xl border border-line bg-green-tint p-6 text-center text-[14px] text-ink-2">
          Gửi CV về email{" "}
          <b className="text-green-d">tuyendung@laptopchinhnguyen.vn</b> hoặc gọi{" "}
          <b className="text-green-d">{SITE.hotline}</b> để được hỗ trợ.
        </div>
      </div>
    </StaticPage>
  );
}
