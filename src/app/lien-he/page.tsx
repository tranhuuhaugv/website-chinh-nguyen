import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ Laptop Chính Nguyễn — hotline ${SITE.hotline}, 2 cơ sở tại Đà Nẵng. Hỗ trợ tư vấn, bảo hành và hợp tác.`,
};

const INFO = [
  { icon: PhoneIcon, label: "Hotline bán hàng", value: SITE.hotline },
  { icon: PhoneIcon, label: "Kỹ thuật - Bảo hành", value: SITE.techPhone },
  { icon: MailIcon, label: "Email", value: SITE.email },
  { icon: ClockIcon, label: "Giờ làm việc", value: SITE.hours },
];

const DEPARTMENTS = [
  { name: "Tư vấn bán hàng", contact: SITE.hotline, email: "sales@laptopchinhnguyen.vn" },
  { name: "Bảo hành - Kỹ thuật", contact: SITE.techPhone, email: "baohanh@laptopchinhnguyen.vn" },
  { name: "Khiếu nại - Góp ý", contact: SITE.hotline, email: "cskh@laptopchinhnguyen.vn" },
  { name: "Hợp tác - Đại lý", contact: SITE.hotline, email: "hoptac@laptopchinhnguyen.vn" },
];

const SOCIALS = [
  { label: "Facebook", href: SITE.facebook, color: "bg-[#1877F2]" },
  { label: "Zalo", href: `https://zalo.me/${SITE.hotlineTel}`, color: "bg-[#0068FF]" },
  { label: "YouTube", href: "https://youtube.com", color: "bg-[#FF0000]" },
  { label: "TikTok", href: "https://tiktok.com", color: "bg-[#111]" },
];

export default function ContactPage() {
  return (
    <StaticPage
      title="Kết nối với Chính Nguyễn"
      lead="Cần tư vấn chọn máy, hỗ trợ bảo hành hay hợp tác kinh doanh? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe bạn."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
      hero={
        <a
          href={`tel:${SITE.hotlineTel}`}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
            <PhoneIcon className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-[12px] text-muted">Hotline CSKH</span>
            <span className="block text-[20px] font-extrabold text-ink">
              {SITE.hotline}
            </span>
          </span>
        </a>
      }
    >
      {/* Kênh liên hệ + form */}
      <Band tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionIntro
              eyebrow="Thông tin liên hệ"
              title="Nhiều cách để kết nối"
              desc="Chọn kênh thuận tiện nhất — chúng tôi phản hồi nhanh trong giờ làm việc."
            />
            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {INFO.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(11,94,44,0.24)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[12.5px] text-muted">{label}</p>
                    <p className="text-[15px] font-bold text-ink">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </Band>

      {/* Cửa hàng */}
      <Band tone="tint">
        <SectionIntro
          center
          eyebrow="Ghé thăm"
          title="Hệ thống cửa hàng"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SITE.stores.map((s) => (
            <div key={s.address} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dd text-white shadow-[0_6px_14px_rgba(11,94,44,0.24)]">
                <MapPinIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[15.5px] font-bold text-ink">{s.name}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                  {s.address}
                </p>
                <p className="mt-1.5 text-[13.5px] text-green-d">
                  {SITE.hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* Bộ phận */}
      <Band tone="white">
        <SectionIntro
          center
          eyebrow="Đúng người, đúng việc"
          title="Liên hệ theo bộ phận"
        />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d) => (
            <div key={d.name} className="border-t-2 border-green pt-4">
              <b className="text-[15px] text-ink">{d.name}</b>
              <p className="mt-2 flex items-center gap-2 text-[13.5px] text-ink-2">
                <PhoneIcon className="h-3.5 w-3.5 text-green" />
                {d.contact}
              </p>
              <p className="mt-1 flex items-center gap-2 text-[13.5px] text-ink-2">
                <MailIcon className="h-3.5 w-3.5 text-green" />
                {d.email}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* Mạng xã hội */}
      <Band tone="tint">
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionIntro center eyebrow="Theo dõi chúng tôi" title="Kết nối mạng xã hội" />
          <div className="flex flex-wrap justify-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-11 items-center rounded-full px-6 text-[13.5px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 ${s.color}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Band>
    </StaticPage>
  );
}
