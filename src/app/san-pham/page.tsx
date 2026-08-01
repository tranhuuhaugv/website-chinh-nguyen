import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { getAllProducts, getNeeds, getSeriesCategories } from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Toàn bộ laptop chính hãng tại Laptop Chính Nguyễn — lọc theo hãng, mức giá và sắp xếp theo nhu cầu của bạn.",
  alternates: { canonical: `${SITE_URL}/san-pham` },
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: RawParams;
}) {
  const [products, series, needs] = await Promise.all([
    getAllProducts(),
    getSeriesCategories(),
    getNeeds(),
  ]);
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <CompareProvider>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Tất cả sản phẩm" },
            ]}
          />
          <h1 className="mb-1 mt-3 text-[26px] font-bold text-ink">
            Tất cả sản phẩm
          </h1>
          <p className="mb-5 text-[13.5px] text-muted">
            Khám phá toàn bộ laptop chính hãng, giá tốt tại Chính Nguyễn.
          </p>

          <ProductBrowser
            basePath="/san-pham"
            searchParams={searchParams}
            products={products}
            brands={brands}
            series={series}
            needs={needs}
          />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
