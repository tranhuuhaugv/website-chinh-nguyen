import Image from "next/image";
import Link from "next/link";

// Logo thương hiệu. Đặt file logo tại: public/logo.png (nền trong suốt).
// Hiển thị trên nền trắng (bo góc) để logo xanh nổi rõ trên header xanh.
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Laptop Chính Nguyễn - Trang chủ"
      className="flex shrink-0 items-center rounded-lg bg-white px-3 py-2"
    >
      <Image
        src="/logo_V1.png"
        alt="Laptop Chính Nguyễn"
        width={228}
        height={40}
        priority
        className="h-8 w-auto object-contain"
      />
    </Link>
  );
}
