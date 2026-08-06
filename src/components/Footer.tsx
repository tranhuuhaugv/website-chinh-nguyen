import Link from "next/link";
import { Container } from "./Container";
import { FooterBadges } from "./FooterBadges";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessengerIcon,
  PhoneIcon,
} from "./icons";
import { SITE } from "@/lib/site";
import { getSetting, getStores } from "@/lib/data";

// Footer dùng chung toàn site. Server Component.

const ABOUT_LINKS = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/he-thong-cua-hang", label: "Hệ thống cửa hàng" },
  { href: "/lien-he", label: "Liên hệ" },
];

const POLICY_LINKS = [
  { href: "/chinh-sach/bao-hanh", label: "Bảo hành" },
  { href: "/chinh-sach/doi-tra", label: "Đổi trả" },
  { href: "/chinh-sach/giao-hang", label: "Giao hàng" },
  { href: "/chinh-sach/tra-gop", label: "Trả góp" },
];

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-[14.5px] font-semibold text-white">{title}</h4>
      <ul className="space-y-[9px]">
        {links.map((link) => (
          <li key={link.href} className="text-[13.5px]">
            <Link
              href={link.href}
              className="inline-block transition hover:translate-x-0.5 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const [stores, bctOn, bctUrl, bctImg, dmcaOn, dmcaUrl, copyrightOn] =
    await Promise.all([
      getStores(),
      getSetting("bctEnabled"),
      getSetting("bctUrl"),
      getSetting("bctImg"),
      getSetting("dmcaEnabled"),
      getSetting("dmcaUrl"),
      getSetting("copyrightEnabled"),
    ]);
  return (
    <footer className="mt-12 bg-ink pb-6 text-[#AEB7B1]">
      {/* Dải CTA hotline (gradient) — gối lên đầu footer cho hiện đại */}
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-gradient-to-r from-green-d via-green to-green-d px-7 py-6 shadow-[0_16px_40px_rgba(11,94,44,0.28)] max-[720px]:px-5">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
              <PhoneIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-white">
                Cần tư vấn chọn laptop phù hợp?
              </p>
              <p className="text-[13px] text-white/85">
                Gọi ngay hotline hoặc chat để được hỗ trợ nhanh nhất.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`tel:${SITE.hotlineTel}`}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-extrabold text-green-d shadow-sm transition hover:-translate-y-0.5"
            >
              <PhoneIcon className="h-[18px] w-[18px]" />
              {SITE.hotline}
            </a>
            <a
              href={`https://zalo.me/${SITE.hotlineTel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-[13.5px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-[9px] font-black text-[#0068FF]">
                Za
              </span>
              Zalo
            </a>
            <a
              href={SITE.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-[13.5px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
            >
              <MessengerIcon className="h-[18px] w-[18px]" />
              Messenger
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-[13.5px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] font-black text-[#1877F2]">
                f
              </span>
              Fanpage
            </a>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-[30px] border-b border-[#2A332D] pb-[30px] pt-11 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          <div>
            <div className="mb-3 text-[22px] font-bold text-white">
              Chính <span className="text-[#7EE0A0]">Nguyễn</span>
            </div>
            <p className="text-[13.5px] leading-[1.7]">
              Laptop Chính Nguyễn — cửa hàng laptop chính hãng tại Đà Nẵng. Cam
              kết giá tốt, bảo hành uy tín, dịch vụ tận tâm.
            </p>
          </div>

          <FooterList title="Về chúng tôi" links={ABOUT_LINKS} />
          <FooterList title="Chính sách" links={POLICY_LINKS} />

          <div>
            <h4 className="mb-3.5 text-[14.5px] font-semibold text-white">
              Liên hệ
            </h4>
            <ul className="space-y-2.5 text-[13.5px]">
              {stores.map((s) => (
                <li key={s.address} className="flex items-start gap-2.5">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#7EE0A0]" />
                  <span className="leading-[1.5]">{s.address}</span>
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 shrink-0 text-[#7EE0A0]" />
                <span>
                  Hotline: <b className="text-white">{SITE.hotline}</b>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-[#7EE0A0]" />
                <span className="text-white">{SITE.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ClockIcon className="h-4 w-4 shrink-0 text-[#7EE0A0]" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <FooterBadges
          bct={{ on: bctOn === "true", url: bctUrl ?? "", img: bctImg ?? "" }}
          dmca={{ on: dmcaOn === "true", url: dmcaUrl ?? "" }}
        />

        {/* Dòng bản quyền TẠM ẨN theo yêu cầu — khi Bộ Công Thương duyệt web
            xong thì bỏ comment quanh khối dưới để hiện lại. */}
        {copyrightOn === "true" && (
          <div className="flex flex-wrap justify-between gap-2 pt-5 text-[12.5px] text-[#78827C]">
            <span>© 2026 Laptop Chính Nguyễn — Đà Nẵng.</span>
            <span>Điều khoản · Bảo mật</span>
          </div>
        )}
      </Container>
    </footer>
  );
}
