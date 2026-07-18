import Image from "next/image";
import Link from "next/link";

// Logo thương hiệu Chính Nguyễn — bản trắng nền trong suốt (sinh từ logo_V1.png)
// đặt trực tiếp lên header xanh lá đậm.
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Laptop Chính Nguyễn - Trang chủ"
      className="flex shrink-0 items-center"
    >
      <Image
        src="/logo_white.png"
        alt="Laptop Chính Nguyễn"
        width={228}
        height={40}
        priority
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
}
