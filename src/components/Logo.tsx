import Link from "next/link";

// Logo thương hiệu Chính Nguyễn — bản ĐỎ có hiệu ứng ánh sáng quét (đặt trên
// header nền trắng). Tô màu bằng CSS mask từ logo_white.png (xem .logo-red
// trong globals.css) nên không cần tạo file ảnh đỏ riêng. Link có aria-label
// nên span logo để aria-hidden.
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Laptop Chính Nguyễn - Trang chủ"
      className="flex shrink-0 items-center"
    >
      <span className="logo-red" aria-hidden="true" />
    </Link>
  );
}
