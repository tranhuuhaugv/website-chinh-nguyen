import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CartButton } from "./cart/CartButton";
import { SearchBox } from "./SearchBox";
import { ClockIcon, MapPinIcon, PhoneIcon, UserIcon } from "./icons";
import { SITE } from "@/lib/site";

// Header dùng chung toàn site: strip thông báo + ô tìm kiếm (autocomplete) + hotline + tài khoản/giỏ.

export function Header() {
  return (
    <header>
      {/* Strip thông báo */}
      <div className="bg-green-dd text-[12.5px] text-[#CDEBD6]">
        <Container className="flex h-9 items-center justify-between max-[720px]:justify-center">
          <div className="flex items-center gap-4 max-[720px]:hidden">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5 text-[#7EE0A0]" />
              Hệ thống Laptop Chính Nguyễn tại Đà Nẵng
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-[#7EE0A0]" />
              {SITE.hours}
            </span>
          </div>
          <nav className="flex items-center gap-[18px]">
            <Link href="/he-thong-cua-hang" className="transition hover:text-white">
              Hệ thống cửa hàng
            </Link>
            <Link href="/chinh-sach/bao-hanh" className="transition hover:text-white">
              Bảo hành
            </Link>
            <Link href="/tuyen-dung" className="transition hover:text-white">
              Tuyển dụng
            </Link>
          </nav>
        </Container>
      </div>

      {/* Thanh chính */}
      <div className="bg-gradient-to-r from-green-d via-green to-green text-white">
        <Container className="flex h-[70px] items-center gap-[22px]">
          <Logo />

          <SearchBox className="h-11 max-w-[560px] flex-1 max-[900px]:hidden" />

          {/* Hotline CSKH */}
          <a
            href={`tel:${SITE.hotlineTel}`}
            className="ml-auto flex items-center gap-2.5 rounded-full bg-white/[0.12] py-1.5 pl-1.5 pr-4 ring-1 ring-white/25 transition hover:bg-white/20 max-[1100px]:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-d shadow-sm">
              <PhoneIcon className="h-[18px] w-[18px]" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] text-white/85">Hotline CSKH</span>
              <span className="block text-[15px] font-bold text-white">
                {SITE.hotline}
              </span>
            </span>
          </a>

          <div className="flex items-center gap-1.5 max-[1100px]:ml-auto">
            <Link
              href="/dang-nhap"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white transition hover:bg-white/[0.14]"
            >
              <UserIcon className="h-5 w-5" />
              <span className="max-[900px]:hidden">Tài khoản</span>
            </Link>
            <CartButton />
          </div>
        </Container>

        {/* Thanh tìm kiếm riêng cho mobile (thanh chính ẩn ô tìm kiếm ở ≤900px) */}
        <div className="hidden pb-2.5 max-[900px]:block">
          <Container>
            <SearchBox className="h-10" placeholder="Bạn cần tìm laptop gì?" />
          </Container>
        </div>
      </div>
    </header>
  );
}
