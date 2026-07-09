import Link from "next/link";
import { Container } from "./Container";
import { FooterBadges } from "./FooterBadges";

// Footer dùng chung toàn site. Server Component.

const ABOUT_LINKS = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/he-thong-cua-hang", label: "Hệ thống cửa hàng" },
  { href: "/tuyen-dung", label: "Tuyển dụng" },
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
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-9 bg-ink pb-6 pt-11 text-[#AEB7B1]">
      <Container>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-[30px] border-b border-[#2A332D] pb-[30px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
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
              Kết nối
            </h4>
            <p className="mb-2 text-[13.5px]">
              Địa chỉ: <b className="text-white">Đà Nẵng</b>
            </p>
            <p className="mb-2.5 text-[13.5px]">
              Hotline: <b className="text-white">1900 6789</b>
            </p>
            <p className="text-[13.5px] leading-[1.7]">
              Nhận tin khuyến mãi mới nhất qua email của bạn.
            </p>
          </div>
        </div>

        <FooterBadges />

        <div className="flex flex-wrap justify-between gap-2 pt-5 text-[12.5px] text-[#78827C]">
          <span>© 2026 Laptop Chính Nguyễn — Đà Nẵng. Bản thiết kế demo.</span>
          <span>Điều khoản · Bảo mật</span>
        </div>
      </Container>
    </footer>
  );
}
