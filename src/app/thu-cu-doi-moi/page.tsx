import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { TradeInForm } from "@/components/TradeInForm";
import { SITE } from "@/lib/site";
import {
  CheckIcon,
  InstallmentIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Thu cũ đổi mới",
  description:
    "Chương trình thu cũ đổi mới tại Laptop Chính Nguyễn — trợ giá tốt, định giá minh bạch, thủ tục nhanh gọn.",
};

const STEPS = [
  {
    title: "Đánh giá máy cũ",
    desc: "Mang máy tới cửa hàng hoặc gửi thông tin, kỹ thuật viên kiểm tra tình trạng.",
  },
  {
    title: "Báo giá thu",
    desc: "Nhận mức định giá minh bạch cho máy cũ của bạn ngay tại chỗ.",
  },
  {
    title: "Trừ thẳng máy mới",
    desc: "Giá thu được trừ trực tiếp vào giá chiếc laptop mới bạn chọn.",
  },
  {
    title: "Nhận máy mới",
    desc: "Hoàn tất thủ tục và nhận máy mới, bảo hành đầy đủ.",
  },
];

const BENEFITS = [
  {
    icon: InstallmentIcon,
    title: "Trợ giá tốt",
    desc: "Định giá cao, hỗ trợ thêm khi bạn lên đời máy mới.",
  },
  {
    icon: ShieldIcon,
    title: "Định giá minh bạch",
    desc: "Kiểm tra rõ ràng, báo giá đúng tình trạng máy.",
  },
  {
    icon: TruckIcon,
    title: "Thủ tục nhanh gọn",
    desc: "Hoàn tất ngay trong ngày, không rườm rà.",
  },
];

const ACCEPTED = [
  "Laptop mọi thương hiệu: Dell, Asus, Acer, Lenovo, HP, MacBook, MSI...",
  "Máy còn hoạt động, không nợ xấu, có nguồn gốc rõ ràng.",
  "Ưu tiên máy còn bảo hành, đầy đủ phụ kiện, hộp.",
];

export default function TradeInPage() {
  return (
    <StaticPage
      title="Thu cũ đổi mới — lên đời dễ dàng"
      lead="Mang laptop cũ đến Chính Nguyễn, nhận trợ giá hấp dẫn và trừ thẳng vào giá máy mới. Định giá minh bạch, thủ tục nhanh gọn."
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Thu cũ đổi mới" },
      ]}
      hero={
        <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
          <p className="text-[26px] font-extrabold text-green">Trợ giá tốt</p>
          <p className="text-[12.5px] text-muted">định giá cao khi lên đời máy mới</p>
        </div>
      }
    >
      {/* Điều kiện + form định giá — ĐẶT LÊN ĐẦU để khách điền ngay */}
      <Band tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionIntro
              eyebrow="Điều kiện"
              title="Chính Nguyễn nhận thu"
              desc="Chúng tôi thu mua đa dạng dòng máy với mức giá cạnh tranh."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {ACCEPTED.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-2"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-green-tint px-5 py-4 text-[14px] text-green-d">
              <InstallmentIcon className="h-5 w-5 shrink-0" />
              <span>
                Gọi ngay <b>{SITE.hotline}</b> để được định giá nhanh máy cũ của
                bạn.
              </span>
            </div>
          </div>

          <div>
            <SectionIntro title="Để lại thông tin định giá" />
            <p className="mt-2 text-[14px] text-ink-2">
              Điền form dưới đây, Chính Nguyễn sẽ liên hệ báo giá sớm nhất.
            </p>
            <div className="mt-6">
              <TradeInForm />
            </div>
          </div>
        </div>
      </Band>

      {/* Quy trình 4 bước */}
      <Band tone="tint">
        <SectionIntro center eyebrow="Đơn giản" title="Quy trình 4 bước" />
        <div className="mt-11 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-[18px] font-extrabold text-white shadow-[0_8px_18px_rgba(11,94,44,0.28)]">
                {i + 1}
              </span>
              <b className="mt-4 block text-[15.5px] text-ink">{step.title}</b>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* Quyền lợi */}
      <Band tone="white">
        <SectionIntro
          center
          eyebrow="Ưu điểm"
          title="Vì sao thu cũ tại Chính Nguyễn?"
        />
        <div className="mt-11 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_12px_26px_rgba(11,94,44,0.30)]">
                <Icon className="h-8 w-8" />
              </span>
              <h3 className="text-[15.5px] font-bold text-ink">{title}</h3>
              <p className="mx-auto mt-2 max-w-[240px] text-[13.5px] leading-relaxed text-ink-2">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Band>

    </StaticPage>
  );
}
