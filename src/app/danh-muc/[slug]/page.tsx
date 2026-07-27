import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import Link from "next/link";
import {
  getAllProducts,
  getBrandBySlug,
  getCategorySeo,
  getSeriesCategories,
} from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategorySeo(params.slug);
  const name = category?.name ?? "Danh mục sản phẩm";
  return {
    title: name,
    // Meta description admin tự soạn -> ưu tiên; chưa có thì dùng mẫu mặc định.
    description:
      category?.metaDescription ||
      `Mua ${name} chính hãng, giá tốt tại Laptop Chính Nguyễn. Trả góp 0%, bảo hành 24 tháng, giao nhanh toàn quốc.`,
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
  const [category, brand, allProducts, allSeries] = await Promise.all([
    getCategorySeo(params.slug),
    getBrandBySlug(params.slug),
    getAllProducts(),
    getSeriesCategories(),
  ]);
  const name = category?.name ?? brand ?? "Danh mục sản phẩm";

  // Trên trang HÃNG: liệt kê các dòng máy của hãng đó (slug bắt đầu bằng slug hãng)
  // -> điều hướng + liên kết nội bộ tốt cho SEO.
  const brandSeries = brand
    ? allSeries.filter((s) => s.slug.startsWith(`${params.slug}-`))
    : [];

  // Lọc theo loại danh mục: hãng / tình trạng (mới-cũ) / nhu cầu / tất cả.
  const NEED_BY_SLUG: Record<string, string> = {
    "laptop-gaming": "gaming",
    "laptop-do-hoa": "do-hoa",
    "laptop-van-phong": "van-phong",
  };
  let baseProducts = allProducts;
  if (brand) {
    baseProducts = allProducts.filter((p) => p.brand === brand);
  } else if (category?.group === "dong-may") {
    // Trang dòng máy (Lenovo ThinkPad, Lenovo Legion...) -> lọc theo cột series.
    baseProducts = allProducts.filter((p) => p.series === params.slug);
  } else if (params.slug === "laptop-moi") {
    baseProducts = allProducts.filter((p) => p.condition === "new");
  } else if (params.slug === "laptop-cu") {
    baseProducts = allProducts.filter((p) => (p.condition ?? "used") === "used");
  } else if (NEED_BY_SLUG[params.slug]) {
    const need = NEED_BY_SLUG[params.slug];
    baseProducts = allProducts.filter((p) => (p.needs ?? []).includes(need));
  }

  const brands = Array.from(new Set(baseProducts.map((p) => p.brand)));

  return (
    <CompareProvider>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: name }]}
          />
          <h1 className="mb-3 mt-3 text-[26px] font-bold text-ink">{name}</h1>

          {/* Dòng máy của hãng — chip điều hướng + link nội bộ SEO */}
          {brandSeries.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {brandSeries.map((s) => (
                <Link
                  key={s.slug}
                  href={`/danh-muc/${s.slug}`}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-green hover:text-green-d"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}

          <ProductBrowser
            basePath={`/danh-muc/${params.slug}`}
            searchParams={searchParams}
            products={baseProducts}
            brands={brands}
          />

          {/* Bài viết SEO (admin tự soạn) — đặt DƯỚI danh sách sản phẩm để
              không đẩy sản phẩm xuống, vẫn giúp lên từ khoá. HTML đã lọc XSS. */}
          {category?.seoContent && (
            <section
              className="rich-text mt-12 border-t border-line pt-8"
              dangerouslySetInnerHTML={{ __html: category.seoContent }}
            />
          )}
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
