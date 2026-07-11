import { BlogSection } from "@/components/BlogSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { CustomerGallery } from "@/components/CustomerGallery";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FlashSale } from "@/components/FlashSale";
import { FloatButtons } from "@/components/FloatButtons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { SideBanners } from "@/components/SideBanners";
import { SubBanners } from "@/components/SubBanners";
import { TrustBar } from "@/components/TrustBar";
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
  getHeroBanners,
  getSetting,
  getSideBanners,
  getSubBanners,
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
      areaServed: "Đà Nẵng",
      telephone: SITE.hotline,
      address: SITE.stores.map((s) => ({
        "@type": "PostalAddress",
        streetAddress: s.address,
        addressLocality: "Đà Nẵng",
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
    featured,
    categories,
    posts,
    customerPhotos,
    heroBanners,
    sideBanners,
    subBanners,
    flashSetting,
  ] = await Promise.all([
    getFlashSaleProducts(),
    getFeaturedProducts(),
    getCategories(),
    getBlogPosts(),
    getCustomerPhotos(),
    getHeroBanners(),
    getSideBanners(),
    getSubBanners(),
    getSetting("flashSaleEnabled"),
  ]);
  const flashOn = flashSetting === "true" && flashProducts.length > 0;

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
        <CategoryNav />
        <HeroSlider slides={HERO_SLIDES} imageSlides={heroBanners} />
        <SubBanners items={subBanners} />
        {flashOn && <FlashSale products={flashProducts} />}
        <CategoryGrid categories={categories} />
        <FeaturedProducts products={featured} tabs={FEATURED_BRAND_TABS} />
        <CustomerGallery photos={customerPhotos} />
        <BlogSection posts={posts} />
        <TrustBar />
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
