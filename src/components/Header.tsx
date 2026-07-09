import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { CartButton } from "./cart/CartButton";
import { SearchIcon, UserIcon } from "./icons";

// Header dùng chung toàn site: strip thông báo + thanh tìm kiếm + tài khoản/giỏ.
// Server Component: form tìm kiếm submit GET sang /tim-kiem (không cần JS).

export function Header() {
  return (
    <header>
      {/* Strip thông báo */}
      <div className="bg-green-dd text-[12.5px] text-[#CDEBD6]">
        <Container className="flex h-[34px] items-center justify-between max-[720px]:justify-center">
          <span className="max-[720px]:hidden">
            Hệ thống Laptop Chính Nguyễn tại Đà Nẵng · Chính hãng · Trả góp 0%
          </span>
          <nav className="flex gap-[18px]">
            <Link href="/tra-cuu-don-hang" className="hover:text-white">
              Tra cứu đơn hàng
            </Link>
            <Link href="/he-thong-cua-hang" className="hover:text-white">
              Hệ thống cửa hàng
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
            className="flex h-[42px] max-w-[560px] flex-1 items-center gap-2.5 rounded-lg bg-white pl-3.5 pr-1.5 max-[900px]:hidden"
          >
            <input
              type="search"
              name="q"
              placeholder="Bạn cần tìm laptop gì hôm nay?"
              className="flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none"
              aria-label="Tìm kiếm sản phẩm"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="flex h-[30px] w-[34px] items-center justify-center rounded-md bg-green text-white"
            >
              <SearchIcon className="h-[17px] w-[17px]" />
            </button>
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

      <NavBar />
    </header>
  );
}
