import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ Laptop Chính Nguyễn — hotline ${SITE.hotline}, 2 cơ sở tại Đà Nẵng. Hỗ trợ tư vấn, bảo hành và hợp tác.`,
};

const INFO = [
  { icon: PhoneIcon, label: "Hotline", value: SITE.hotline },
  { icon: PhoneIcon, label: "Kỹ thuật", value: SITE.techPhone },
  { icon: MailIcon, label: "Email", value: SITE.email },
  { icon: ClockIcon, label: "Giờ làm việc", value: SITE.hours },
];

const DEPARTMENTS = [
  { name: "Tư vấn bán hàng", contact: SITE.hotline, email: "sales@laptopchinhnguyen.vn" },
  { name: "Bảo hành - Kỹ thuật", contact: SITE.techPhone, email: "baohanh@laptopchinhnguyen.vn" },
  { name: "Khiếu nại - Góp ý", contact: SITE.hotline, email: "cskh@laptopchinhnguyen.vn" },
  { name: "Hợp tác - Đại lý", contact: SITE.hotline, email: "hoptac@laptopchinhnguyen.vn" },
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
                  className="flex items-start gap-3 rounded-2xl border border-line bg-white shadow-card p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(21,154,72,0.24)]">
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

        {/* Địa chỉ cửa hàng */}
        <section className="rounded-2xl border border-line bg-white shadow-card p-6">
          <h2 className="mb-4 text-[18px] font-bold text-ink">
            Địa chỉ cửa hàng
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SITE.stores.map((s) => (
              <div key={s.address} className="flex items-start gap-3 rounded-xl bg-bg p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(21,154,72,0.24)]">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{s.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-2">{s.address}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phòng ban */}
        <section className="rounded-2xl border border-line bg-white shadow-card p-6">
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
        <section className="rounded-2xl border border-line bg-white shadow-card p-6">
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
