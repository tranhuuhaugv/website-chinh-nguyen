import { BlogSection } from "@/components/BlogSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CustomerGallery } from "@/components/CustomerGallery";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FlashSale } from "@/components/FlashSale";
import { FloatButtons } from "@/components/FloatButtons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { SideBanners } from "@/components/SideBanners";
import { TrustBar } from "@/components/TrustBar";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import {
  BLOG_POSTS,
  CATEGORIES,
  FEATURED_BRAND_TABS,
  CUSTOMER_PHOTOS,
  FEATURED_PRODUCTS,
  FLASH_SALE_PRODUCTS,
  HERO_SLIDES,
  SIDE_BANNERS,
} from "@/lib/mock-data";

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
      telephone: "1900 6789",
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

export default function HomePage() {
  return (
    <CompareProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <SideBanners left={SIDE_BANNERS[0]} right={SIDE_BANNERS[1]} />
      <main>
        <HeroSlider slides={HERO_SLIDES} />
        <FlashSale products={FLASH_SALE_PRODUCTS} />
        <CategoryGrid categories={CATEGORIES} />
        <FeaturedProducts
          products={FEATURED_PRODUCTS}
          tabs={FEATURED_BRAND_TABS}
        />
        <CustomerGallery photos={CUSTOMER_PHOTOS} />
        <BlogSection posts={BLOG_POSTS} />
        <TrustBar />
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
