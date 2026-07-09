import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { ContactForm } from "@/components/ContactForm";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ Laptop Chính Nguyễn — hotline 1900 6789, cửa hàng tại Đà Nẵng. Hỗ trợ tư vấn, bảo hành và hợp tác.",
};

const INFO = [
  { icon: MapPinIcon, label: "Địa chỉ", value: "123 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng" },
  { icon: PhoneIcon, label: "Hotline", value: "1900 6789" },
  { icon: MailIcon, label: "Email", value: "hotro@laptopchinhnguyen.vn" },
  { icon: ClockIcon, label: "Giờ làm việc", value: "8:00 - 21:00 (T2 - CN)" },
];

const DEPARTMENTS = [
  { name: "Tư vấn bán hàng", contact: "1900 6789 (nhánh 1)", email: "sales@laptopchinhnguyen.vn" },
  { name: "Bảo hành - Kỹ thuật", contact: "1900 6789 (nhánh 2)", email: "baohanh@laptopchinhnguyen.vn" },
  { name: "Khiếu nại - Góp ý", contact: "1900 6789 (nhánh 3)", email: "cskh@laptopchinhnguyen.vn" },
  { name: "Hợp tác - Đại lý", contact: "1900 6789 (nhánh 4)", email: "hoptac@laptopchinhnguyen.vn" },
];

export default function ContactPage() {
  return (
    <StaticPage
      title="Liên hệ"
      lead="Chúng tôi luôn sẵn sàng hỗ trợ bạn — tư vấn sản phẩm, bảo hành hay hợp tác kinh doanh."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Thông tin + form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-[14.5px] leading-relaxed text-ink-2">
              Bạn cần tư vấn chọn máy, hỗ trợ bảo hành hay muốn hợp tác? Hãy liên
              hệ với chúng tôi qua các kênh dưới đây hoặc để lại lời nhắn, đội ngũ
              Chính Nguyễn sẽ phản hồi trong thời gian sớm nhất.
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INFO.map(({ icon: Icon, label, value }) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[12.5px] text-muted">{label}</p>
                    <p className="text-[13.5px] font-semibold text-ink">
                      {value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>

        {/* Phòng ban */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Liên hệ theo bộ phận
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <div key={d.name} className="rounded-xl bg-bg p-4">
                <b className="text-[14px] text-ink">{d.name}</b>
                <p className="mt-1.5 flex items-center gap-2 text-[13px] text-ink-2">
                  <PhoneIcon className="h-3.5 w-3.5 text-green" />
                  {d.contact}
                </p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-ink-2">
                  <MailIcon className="h-3.5 w-3.5 text-green" />
                  {d.email}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Kênh kết nối */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 text-[18px] font-bold text-ink">Kết nối với chúng tôi</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Facebook", href: "https://facebook.com", color: "bg-[#1877F2]" },
              { label: "Zalo", href: "https://zalo.me", color: "bg-[#0068FF]" },
              { label: "YouTube", href: "https://youtube.com", color: "bg-[#FF0000]" },
              { label: "TikTok", href: "https://tiktok.com", color: "bg-[#111]" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 items-center rounded-xl px-5 text-[13.5px] font-semibold text-white transition hover:opacity-90 ${s.color}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
