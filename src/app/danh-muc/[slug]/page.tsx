import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { ALL_PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Map slug -> tên hãng để lọc sản phẩm theo hãng.
// (Các danh mục theo loại như "laptop-gaming" hiện chưa có trường phân loại trong
// mock data nên tạm hiển thị tất cả — sẽ lọc đúng khi có DB với categoryId.)
const BRAND_BY_SLUG: Record<string, string> = {
  dell: "Dell",
  asus: "Asus",
  acer: "Acer",
  lenovo: "Lenovo",
  hp: "HP",
  macbook: "MacBook",
  msi: "MSI",
};

function getCategoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? "Danh mục sản phẩm";
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const name = getCategoryName(params.slug);
  return {
    title: name,
    description: `Mua ${name} chính hãng, giá tốt tại Laptop Chính Nguyễn. Trả góp 0%, bảo hành 24 tháng, giao nhanh toàn quốc.`,
    alternates: { canonical: `${SITE_URL}/danh-muc/${params.slug}` },
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: RawParams;
}) {
  const name = getCategoryName(params.slug);
  const brand = BRAND_BY_SLUG[params.slug];
  const baseProducts = brand
    ? ALL_PRODUCTS.filter((p) => p.brand === brand)
    : ALL_PRODUCTS;

  // Hãng để lọc: các hãng thực sự có trong tập sản phẩm hiện tại.
  const brands = Array.from(new Set(baseProducts.map((p) => p.brand)));

  return (
    <CompareProvider>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: name }]}
          />
          <h1 className="mb-5 mt-3 text-[26px] font-bold text-ink">{name}</h1>

          <ProductBrowser
            basePath={`/danh-muc/${params.slug}`}
            searchParams={searchParams}
            products={baseProducts}
            brands={brands}
          />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
