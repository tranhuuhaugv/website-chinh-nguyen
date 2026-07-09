import type { ProductAccent } from "@/lib/types";

// Ảnh placeholder minh hoạ laptop (SVG), khớp card trong design.
// KHI CÓ ẢNH THẬT: thay bằng <Image> của next/image, dùng Cloudinary transform
// trả đúng kích thước ô hiển thị (xem next.config.mjs + CLAUDE.md).

const SCREEN_GRADIENT: Record<ProductAccent, [string, string]> = {
  blue: ["#2E86DE", "#10559A"],
  red: ["#F0433B", "#7A1712"],
  silver: ["#E9ECF0", "#C6CCD4"],
  crimson: ["#D64545", "#9A2424"],
  dark: ["#3A4250", "#20262E"],
};

export function ProductImage({
  accent,
  uid,
}: {
  accent: ProductAccent;
  /** Định danh duy nhất (dùng slug) để id gradient không trùng giữa các card. */
  uid: string;
}) {
  const [from, to] = SCREEN_GRADIENT[accent];
  const screenId = `scr-${uid}`;
  const bgId = `bg-${uid}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label="Ảnh minh hoạ sản phẩm laptop"
    >
      <defs>
        <linearGradient id={screenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBFCFB" />
          <stop offset="1" stopColor="#EEF0EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${bgId})`} />
      <ellipse cx="200" cy="236" rx="150" ry="13" fill="#000" opacity="0.05" />
      <rect x="92" y="52" width="216" height="146" rx="12" fill="#20262E" />
      <rect x="102" y="62" width="196" height="126" rx="5" fill={`url(#${screenId})`} />
      <circle cx="150" cy="100" r="34" fill="#ffffff" opacity="0.1" />
      <circle cx="255" cy="150" r="26" fill="#ffffff" opacity="0.09" />
      <circle cx="200" cy="57" r="1.6" fill="#3a424c" />
      <path d="M70 198 H330 L352 232 H48 Z" fill="#C9CED4" />
      <path d="M70 198 H330 L331 203 H69 Z" fill="#00000012" />
      <rect x="175" y="200" width="50" height="5" rx="2.5" fill="#9aa1a8" />
    </svg>
  );
}
