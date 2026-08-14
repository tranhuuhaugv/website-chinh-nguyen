import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { SiteSettingsProvider } from "@/components/SiteSettingsContext";
import { VisitorTracker } from "@/components/VisitorTracker";
import { MobileBottomNav } from "@/components/MobileBottomNav";

// Font Inter TỰ HOST (không tải từ Google lúc build) -> deploy không phụ thuộc
// mạng Google Fonts. Dùng font variable (1 file, đủ weight + subset vietnamese).
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const SITE_NAME = "Laptop Chính Nguyễn";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Laptop chính hãng giá tốt tại Đà Nẵng`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Cửa hàng laptop chính hãng tại Đà Nẵng. Trả góp 0%, bảo hành 12 tháng, giao nhanh toàn quốc. Dell, Asus, Acer, Lenovo, HP, MacBook giá tốt mỗi ngày.",
  keywords: [
    "laptop",
    "laptop chính hãng",
    "laptop Đà Nẵng",
    "laptop gaming",
    "MacBook",
    "trả góp 0%",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Laptop chính hãng giá tốt`,
    description:
      "Laptop chính hãng, trả góp 0%, bảo hành 12 tháng, giao nhanh toàn quốc.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Laptop chính hãng giá tốt`,
    description:
      "Laptop chính hãng, trả góp 0%, bảo hành 12 tháng, giao nhanh toàn quốc.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased pb-[54px] lg:pb-0">
        <SiteSettingsProvider>
          <CartProvider>
            {children}
            <MobileBottomNav />
          </CartProvider>
        </SiteSettingsProvider>
        <VisitorTracker />
      </body>
    </html>
  );
}
