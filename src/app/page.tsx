import { BlogSection } from "@/components/BlogSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CustomerGallery } from "@/components/CustomerGallery";
import { VoucherStrip } from "@/components/VoucherStrip";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FlashSale } from "@/components/FlashSale";
import { FloatButtons } from "@/components/FloatButtons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { SideBanners } from "@/components/SideBanners";
import { TradeInCTA } from "@/components/TradeInCTA";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import {
  FEATURED_BRAND_TABS,
  HERO_SLIDES,
  SIDE_BANNERS,
} from "@/lib/mock-data";
import {
  getBlogPosts,
  getCategories,
  getCustomerPhotos,
  getFeaturedProducts,
  getFlashSaleProducts,
  getNewProducts,
  getVouchers,
  getHeroBanners,
  getSetting,
  getSideBanners,
  getVoucherUsage,
} from "@/lib/data";
import { SITE } from "@/lib/site";

// Trang chủ ít thay đổi -> ISR: build tĩnh, tự làm mới mỗi giờ (quy tắc CLAUDE.md).
// Khi nối DB, các mảng mock ở trên sẽ thay bằng query Prisma (có select/pagination).
export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Structured data cho trang chủ (Organization + WebSite có ô tìm kiếm).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Laptop Chính Nguyễn",
      url: SITE_URL,
      areaServed: ["Đà Nẵng", "Hội An"],
      telephone: SITE.hotline,
      address: SITE.stores.map((s) => ({
        "@type": "PostalAddress",
        streetAddress: s.address,
        addressLocality: s.city,
        addressCountry: "VN",
      })),
    },
    {
      "@type": "WebSite",
      name: "Laptop Chính Nguyễn",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/tim-kiem?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function HomePage() {
  const [
    flashProducts,
    newProducts,
    featured,
    categories,
    posts,
    customerPhotos,
    heroBanners,
    sideBanners,
    flashSetting,
    voucherSetting,
  ] = await Promise.all([
    getFlashSaleProducts(),
    getNewProducts(),
    getFeaturedProducts(),
    getCategories(),
    getBlogPosts(),
    getCustomerPhotos(),
    getHeroBanners(),
    getSideBanners(),
    getSetting("flashSaleEnabled"),
    getSetting("vouchersEnabled"),
  ]);
  const flashOn = flashSetting === "true" && flashProducts.length > 0;
  const vouchersOn = voucherSetting === "true";
  // Chỉ đếm số lượt + lấy danh sách mã khi khối đang bật (tránh query thừa).
  const [voucherUsage, vouchers] = vouchersOn
    ? await Promise.all([getVoucherUsage(), getVouchers()])
    : [{} as Record<string, number>, []];

  return (
    <CompareProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <SideBanners
        left={SIDE_BANNERS[0]}
        right={SIDE_BANNERS[1]}
        images={sideBanners}
      />
      <main>
        <HeroSlider slides={HERO_SLIDES} imageSlides={heroBanners} />
        {vouchersOn && (
          <VoucherStrip usage={voucherUsage} vouchers={vouchers} />
        )}
        {flashOn && (
          <FlashSale flashProducts={flashProducts} newProducts={newProducts} />
        )}
        {/* Ẩn "dòng máy" (Lenovo ThinkPad...) khỏi lưới trang chủ — chúng chỉ
            là danh mục con SEO, truy cập từ trang hãng / sản phẩm. */}
        <CategoryGrid
          categories={categories.filter((c) => c.group !== "dong-may")}
        />
        <FeaturedProducts products={featured} tabs={FEATURED_BRAND_TABS} />
        <CustomerGallery photos={customerPhotos} />
        <TradeInCTA />
        <BlogSection posts={posts} />
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
