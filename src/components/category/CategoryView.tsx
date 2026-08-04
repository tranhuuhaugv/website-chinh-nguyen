import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import {
  getAllProducts,
  getBrandBySlug,
  getCategorySeo,
  getNeeds,
  getSeriesCategories,
  type CategorySeo,
} from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Metadata trang danh mục/hãng (route gốc /[slug] gọi khi slug là danh mục).
export function buildCategoryMetadata(
  category: CategorySeo | null,
  slug: string,
): Metadata {
  const name = category?.name ?? "Danh mục sản phẩm";
  return {
    title: name,
    description:
      category?.metaDescription ||
      `Mua ${name} chính hãng, giá tốt tại Laptop Chính Nguyễn. Trả góp 0%, bảo hành 24 tháng, giao nhanh toàn quốc.`,
    alternates: { canonical: `${SITE_URL}/${slug}` },
  };
}

export async function CategoryView({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: RawParams;
}) {
  const [category, brand, allProducts, allSeries, needs] = await Promise.all([
    getCategorySeo(slug),
    getBrandBySlug(slug),
    getAllProducts(),
    getSeriesCategories(),
    getNeeds(),
  ]);
  const name = category?.name ?? brand ?? "Danh mục sản phẩm";
  const isSeriesPage = category?.group === "dong-may";

  const brandSlug = brand ? slug : isSeriesPage ? slug.split("-")[0] : null;
  const brandSeries = brandSlug
    ? allSeries.filter((s) => s.slug.startsWith(`${brandSlug}-`))
    : [];
  const brandName =
    brand ??
    (isSeriesPage
      ? (allProducts.find((p) => p.series === slug)?.brand ?? null)
      : null);
  const brandCrumb =
    isSeriesPage && brandName && brandSlug
      ? { label: brandName, href: `/${brandSlug}` }
      : null;

  const NEED_BY_SLUG: Record<string, string> = {
    "laptop-gaming": "gaming",
    "laptop-do-hoa": "do-hoa",
    "laptop-van-phong": "van-phong",
  };
  let baseProducts = allProducts;
  if (brand) {
    baseProducts = allProducts.filter((p) => p.brand === brand);
  } else if (category?.group === "dong-may") {
    baseProducts = allProducts.filter((p) => p.series === slug);
  } else if (slug === "laptop-moi") {
    baseProducts = allProducts.filter((p) => p.condition === "new");
  } else if (slug === "laptop-cu") {
    baseProducts = allProducts.filter((p) => (p.condition ?? "used") === "used");
  } else if (NEED_BY_SLUG[slug]) {
    const need = NEED_BY_SLUG[slug];
    baseProducts = allProducts.filter((p) => (p.needs ?? []).includes(need));
  }

  const brands = Array.from(new Set(baseProducts.map((p) => p.brand)));

  return (
    <CompareProvider>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              ...(brandCrumb ? [brandCrumb] : []),
              { label: name },
            ]}
          />
          {category?.cover && (
            <div className="relative mt-4 aspect-[1200/260] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 max-[640px]:aspect-[1200/440]">
              <Image
                src={category.cover}
                alt={name}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <h1 className="mb-3 mt-3 text-[26px] font-bold text-ink">{name}</h1>

          {brandSeries.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {brandSlug && (
                <Link
                  href={`/${brandSlug}`}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                    !isSeriesPage
                      ? "border-green bg-green-tint text-green-d"
                      : "border-line bg-white text-ink-2 hover:border-green hover:text-green-d"
                  }`}
                >
                  Tất cả {brandName ?? "hãng"}
                </Link>
              )}
              {brandSeries.map((s) => {
                const active = s.slug === slug;
                return active ? (
                  <span
                    key={s.slug}
                    aria-current="page"
                    className="rounded-full border border-green bg-green-tint px-3.5 py-1.5 text-[13px] font-semibold text-green-d"
                  >
                    {s.name}
                  </span>
                ) : (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-green hover:text-green-d"
                  >
                    {s.name}
                  </Link>
                );
              })}
            </div>
          )}

          <ProductBrowser
            basePath={`/${slug}`}
            searchParams={searchParams}
            products={baseProducts}
            brands={brands}
            needs={needs}
          />

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
