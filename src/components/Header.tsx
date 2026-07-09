import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CartButton } from "./cart/CartButton";
import { SearchIcon, UserIcon } from "./icons";
import { SITE } from "@/lib/site";

// Header dùng chung toàn site: strip thông báo + thanh tìm kiếm + tài khoản/giỏ.
// Server Component: form tìm kiếm submit GET sang /tim-kiem (không cần JS).

export function Header() {
  return (
    <header>
      {/* Strip thông báo */}
      <div className="bg-green-dd text-[12.5px] text-[#CDEBD6]">
        <Container className="flex h-[34px] items-center justify-between max-[720px]:justify-center">
          <span className="max-[720px]:hidden">
            Hệ thống Laptop Chính Nguyễn tại Đà Nẵng · Hotline:{" "}
            <a href={`tel:${SITE.hotlineTel}`} className="font-semibold text-white">
              {SITE.hotline}
            </a>
          </span>
          <nav className="flex gap-[18px]">
            <Link href="/he-thong-cua-hang" className="hover:text-white">
              Hệ thống cửa hàng
            </Link>
            <Link href="/chinh-sach/bao-hanh" className="hover:text-white">
              Bảo hành
            </Link>
            <Link href="/tuyen-dung" className="hover:text-white">
              Tuyển dụng
            </Link>
          </nav>
        </Container>
      </div>

      {/* Thanh chính */}
      <div className="bg-green text-white">
        <Container className="flex h-[70px] items-center gap-[22px]">
          <Logo />

          <form
            action="/tim-kiem"
            className="flex h-11 max-w-[640px] flex-1 items-center rounded-full bg-white pl-2 pr-4 max-[900px]:hidden"
          >
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:text-green-d"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>
            <input
              type="search"
              name="q"
              placeholder="Bạn cần tìm laptop gì hôm nay?"
              className="flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none"
              aria-label="Tìm kiếm sản phẩm"
            />
          </form>

          <div className="ml-auto flex items-center gap-1.5">
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
      </div>
    </header>
  );
}
