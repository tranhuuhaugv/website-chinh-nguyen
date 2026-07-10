import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { getAllProducts, getBrandBySlug, getCategoryName } from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = (await getCategoryName(params.slug)) ?? "Danh mục sản phẩm";
  return {
    title: name,
    description: `Mua ${name} chính hãng, giá tốt tại Laptop Chính Nguyễn. Trả góp 0%, bảo hành 24 tháng, giao nhanh toàn quốc.`,
    alternates: { canonical: `${SITE_URL}/danh-muc/${params.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: RawParams;
}) {
  const [categoryName, brand, allProducts] = await Promise.all([
    getCategoryName(params.slug),
    getBrandBySlug(params.slug),
    getAllProducts(),
  ]);
  const name = categoryName ?? brand ?? "Danh mục sản phẩm";

  // Nếu slug là một hãng -> lọc theo hãng; ngược lại hiển thị tất cả.
  const baseProducts = brand
    ? allProducts.filter((p) => p.brand === brand)
    : allProducts;

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
