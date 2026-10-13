import { BlogSection } from "@/components/BlogSection";
import { ComingSoon } from "@/components/ComingSoon";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CustomerGallery } from "@/components/CustomerGallery";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FlashSale } from "@/components/FlashSale";
import { FloatButtons } from "@/components/FloatButtons";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { HomeIntro } from "@/components/HomeIntro";
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
  getHeroBanners,
  getSetting,
  getSideBanners,
  getStores,
} from "@/lib/data";
import { SITE } from "@/lib/site";
import type { Store } from "@/lib/types";

// Trang chủ ít thay đổi -> ISR: build tĩnh, tự làm mới mỗi giờ (quy tắc CLAUDE.md).
// Khi nối DB, các mảng mock ở trên sẽ thay bằng query Prisma (có select/pagination).
export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.com.vn";

// Structured data cho trang chủ: Organization + từng cửa hàng là ComputerStore
// (LocalBusiness — tín hiệu chính cho tìm kiếm "laptop Đà Nẵng") + WebSite có ô
// tìm kiếm. Địa chỉ lấy từ danh sách cửa hàng thật (admin sửa được) -> luôn khớp.
function buildJsonLd(stores: Store[]) {
  const cities = Array.from(new Set(stores.map((s) => s.city)));
  const orgId = `${SITE_URL}/#organization`;
  const sameAs = [SITE.facebook, SITE.zalo];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        url: SITE_URL,
        logo: `${SITE_URL}/logo_V1.png`,
        email: SITE.email,
        telephone: SITE.hotlineTel,
        areaServed: cities.length ? cities : ["Đà Nẵng"],
        sameAs,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: `+84${SITE.hotlineTel.slice(1)}`,
            contactType: "sales",
            areaServed: "VN",
            availableLanguage: "Vietnamese",
          },
          {
            "@type": "ContactPoint",
            telephone: `+84${SITE.techTel.slice(1)}`,
            contactType: "technical support",
            areaServed: "VN",
            availableLanguage: "Vietnamese",
          },
        ],
      },
      ...stores.map((s, i) => ({
        "@type": "ComputerStore",
        "@id": `${SITE_URL}/he-thong-cua-hang#store-${i + 1}`,
        name: s.name,
        url: `${SITE_URL}/he-thong-cua-hang`,
        image: `${SITE_URL}/logo_V1.png`,
        telephone: SITE.hotlineTel,
        priceRange: "₫₫",
        parentOrganization: { "@id": orgId },
        address: {
          "@type": "PostalAddress",
          streetAddress: s.address,
          addressLocality: s.city,
          addressRegion: s.city,
          addressCountry: "VN",
        },
        // Giờ mở cửa: 8:00 - 21:00, cả tuần (SITE.hours).
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:00",
          closes: "21:00",
        },
        ...(s.mapUrl ? { hasMap: s.mapUrl } : {}),
        sameAs,
      })),
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
}

export default async function HomePage() {
  // Chế độ "Website đang hoàn thiện" (bật/tắt ở admin > Cài đặt). Bật -> hiện
  // trang chờ thay cho toàn bộ nội dung; tắt -> trang chủ bình thường.
  if ((await getSetting("comingSoon")) === "true") {
    return <ComingSoon />;
  }

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
    stores,
    flashStart,
    flashEnd,
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
    getStores(),
    getSetting("flashSaleStart"),
    getSetting("flashSaleEnd"),
  ]);
  const jsonLd = buildJsonLd(stores);
  // Lịch Flash Sale theo giờ VN ("YYYY-MM-DDTHH:mm"). So sánh chuỗi (cùng định
  // dạng) -> khỏi lệ thuộc timezone máy chủ. Trống = không giới hạn đầu/cuối.
  const nowVN = new Date(Date.now() + 7 * 3600 * 1000)
    .toISOString()
    .slice(0, 16);
  const trongLich =
    (!flashStart || nowVN >= flashStart) && (!flashEnd || nowVN < flashEnd);
  const flashOn =
    flashSetting === "true" && trongLich && flashProducts.length > 0;

  return (
    <CompareProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <SideBanners
        left={SIDE_BANNERS[0]}
        right={SIDE_BANNERS[1]}
        images={sideBanners}
      />
      <main>
        <HeroSlider slides={HERO_SLIDES} imageSlides={heroBanners} />
        {flashOn && (
          <FlashSale
            flashProducts={flashProducts}
            newProducts={newProducts}
            startsAt={flashStart ?? ""}
            endsAt={flashEnd ?? ""}
          />
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
        <HomeIntro
          categories={categories.filter((c) => c.group !== "dong-may")}
          stores={stores}
        />
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
