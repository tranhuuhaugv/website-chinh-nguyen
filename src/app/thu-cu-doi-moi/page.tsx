import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
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
    "Chương trình thu cũ đổi mới tại Laptop Chính Nguyễn — trợ giá đến 3.000.000₫, định giá minh bạch, thủ tục nhanh gọn.",
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
    title: "Trừ thẳng giá máy mới",
    desc: "Giá thu được trừ trực tiếp vào giá chiếc laptop mới bạn chọn.",
  },
  {
    title: "Nhận máy mới",
    desc: "Hoàn tất thủ tục và nhận máy mới, bảo hành đầy đủ.",
  },
];

const BENEFITS = [
  { icon: InstallmentIcon, title: "Trợ giá đến 3 triệu", desc: "Định giá cao, hỗ trợ thêm khi lên đời máy mới." },
  { icon: ShieldIcon, title: "Định giá minh bạch", desc: "Kiểm tra rõ ràng, báo giá đúng tình trạng máy." },
  { icon: TruckIcon, title: "Thủ tục nhanh gọn", desc: "Hoàn tất ngay trong ngày, không rườm rà." },
];

const ACCEPTED = [
  "Laptop mọi thương hiệu: Dell, Asus, Acer, Lenovo, HP, MacBook, MSI...",
  "Máy còn hoạt động, không nợ xấu, có nguồn gốc rõ ràng.",
  "Ưu tiên máy còn bảo hành, đầy đủ phụ kiện, hộp.",
];

export default function TradeInPage() {
  return (
    <StaticPage
      title="Thu cũ đổi mới"
      lead="Lên đời laptop mới dễ dàng hơn — mang máy cũ đến Chính Nguyễn, nhận trợ giá hấp dẫn và trừ thẳng vào máy mới."
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Thu cũ đổi mới" },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Quy trình */}
        <section>
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Quy trình 4 bước
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <b className="mt-3 block text-[14.5px] text-ink">{step.title}</b>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quyền lợi */}
        <section>
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Vì sao thu cũ tại Chính Nguyễn?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft text-green">
                  <Icon className="h-5 w-5" />
                </span>
                <b className="mt-3 block text-[14.5px] text-ink">{title}</b>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Điều kiện + form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 text-[18px] font-bold text-ink">
              Nhận thu các dòng máy
            </h2>
            <ul className="flex flex-col gap-3">
              {ACCEPTED.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-2"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-green-tint px-4 py-3 text-[13.5px] text-green-d">
              Gọi ngay <b>{SITE.hotline}</b> để được định giá nhanh máy cũ của
              bạn.
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[18px] font-bold text-ink">
              Để lại thông tin định giá
            </h2>
            <TradeInForm />
          </section>
        </div>
      </div>
    </StaticPage>
  );
}
