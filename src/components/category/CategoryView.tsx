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
import { ArrowRightIcon, CpuIcon } from "@/components/icons";
import {
  getAllProducts,
  getBrandBySlug,
  getCategorySeo,
  getNavCategories,
  getNeeds,
  getSeriesCategories,
  isNeedCategory,
  normGroup,
  type CategorySeo,
} from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.com.vn";

// Metadata trang danh mục/hãng (route gốc /[slug] gọi khi slug là danh mục).
// Title mặc định nhắm từ khoá địa phương: trang hãng / dòng máy -> "Laptop Dell
// cũ, mới giá tốt tại Đà Nẵng"; danh mục khác -> "<tên> giá tốt tại Đà Nẵng".
function defaultCategoryTitle(name: string, isBrandLike: boolean): string {
  if (!isBrandLike) return `${name} giá tốt tại Đà Nẵng`;
  const prefix = /laptop|macbook/i.test(name) ? "" : "Laptop ";
  return `${prefix}${name} cũ, mới giá tốt tại Đà Nẵng`;
}

export function buildCategoryMetadata(
  category: CategorySeo | null,
  slug: string,
  brand: string | null,
  searchParams: RawParams,
): Metadata {
  const name = category?.name ?? brand ?? "Danh mục sản phẩm";
  const isBrandLike = !!brand || normGroup(category?.group) === "dong-may";
  const page = Number(searchParams.trang) > 1 ? Number(searchParams.trang) : 1;
  const baseTitle = category?.metaTitle || defaultCategoryTitle(name, isBrandLike);
  const title = page > 1 ? `${baseTitle} - Trang ${page}` : baseTitle;
  const label =
    isBrandLike && !/laptop|macbook/i.test(name) ? `laptop ${name}` : name;
  const description =
    category?.metaDescription ||
    `Mua ${label} tại Đà Nẵng giá tốt ở Laptop Chính Nguyễn: máy mới & like new kiểm tra kỹ, bảo hành 12 tháng, hỗ trợ trả góp, giao nhanh toàn quốc.`;
  // Trang 2+ tự canonical về chính nó (có ?trang=); bộ lọc/sắp xếp -> về trang gốc.
  const url = `${SITE_URL}/${slug}${page > 1 ? `?trang=${page}` : ""}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function CategoryView({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: RawParams;
}) {
  const [category, brand, allProducts, allSeries, needs, nav] =
    await Promise.all([
      getCategorySeo(slug),
      getBrandBySlug(slug),
      getAllProducts(),
      getSeriesCategories(),
      getNeeds(),
      getNavCategories(),
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

  // Tag nhu cầu CŨ (dữ liệu trước đây) theo slug danh mục -> vẫn khớp để không
  // mất sản phẩm đã gắn.
  const LEGACY_NEED: Record<string, string> = {
    "laptop-gaming": "gaming",
    "laptop-do-hoa": "do-hoa",
    "laptop-van-phong": "van-phong",
  };
  const isNeed =
    (category ? isNeedCategory({ group: category.group, slug }) : false) ||
    !!LEGACY_NEED[slug];
  // Mặc định RỖNG: danh mục chưa có quy tắc gắn sản phẩm (VD PC, màn hình, phụ
  // kiện) thì hiện rỗng, KHÔNG rơi vào "hiện tất cả sản phẩm" như trước.
  let baseProducts: typeof allProducts = [];
  if (brand) {
    baseProducts = allProducts.filter((p) => p.brand === brand);
  } else if (normGroup(category?.group) === "dong-may") {
    baseProducts = allProducts.filter((p) => p.series === slug);
  } else if (slug === "laptop-moi") {
    baseProducts = allProducts.filter((p) => p.condition === "new");
  } else if (slug === "laptop-cu") {
    baseProducts = allProducts.filter((p) => (p.condition ?? "used") === "used");
  } else if (isNeed) {
    // Danh mục nhu cầu: khớp tag = slug (mới) HOẶC tag cũ HOẶC cột category.
    const legacy = LEGACY_NEED[slug];
    baseProducts = allProducts.filter((p) => {
      const n = p.needs ?? [];
      return n.includes(slug) || (legacy ? n.includes(legacy) : false) || p.category === slug;
    });
  } else {
    // Danh mục "đứng riêng" (PC đồng bộ, Màn hình, Phụ kiện): sản phẩm được gán
    // trực tiếp bằng ô "Danh mục" trong admin (cột category).
    baseProducts = allProducts.filter((p) => p.category === slug);
  }

  const brands = Array.from(new Set(baseProducts.map((p) => p.brand)));

  // Structured data: breadcrumb + FAQPage (chỉ khi admin có nhập FAQ).
  const faq = category?.faq ?? [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          ...(brandCrumb
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: brandCrumb.label,
                  item: `${SITE_URL}${brandCrumb.href}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: brandCrumb ? 3 : 2,
            name,
            item: `${SITE_URL}/${slug}`,
          },
        ],
      },
      ...(faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <CompareProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

          {slug === "pc" && (
            <Link
              href="/build-pc"
              className="group mb-5 flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-green-d to-green px-5 py-4 text-white shadow-product transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <CpuIcon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-[16px] font-extrabold">
                  Tự build PC theo ý bạn
                </b>
                <span className="block text-[13px] text-white/85">
                  Chọn từng linh kiện — CPU, VGA, RAM… tổng tiền tự cộng ngay.
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-extrabold text-green-d transition group-hover:gap-2.5">
                Build PC
                <ArrowRightIcon className="h-[18px] w-[18px]" />
              </span>
            </Link>
          )}

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
            needCategories={nav.needs}
          />

          {category?.seoContent && (
            <section
              className="rich-text mt-12 border-t border-line pt-8"
              dangerouslySetInnerHTML={{ __html: category.seoContent }}
            />
          )}

          {faq.length > 0 && (
            <section className="mt-10 border-t border-line pt-8">
              <h2 className="mb-4 text-[20px] font-bold text-ink">
                Câu hỏi thường gặp
              </h2>
              <div className="divide-y divide-line rounded-2xl border border-line bg-white">
                {faq.map((f) => (
                  <details key={f.q} className="group px-5 py-4">
                    <summary className="cursor-pointer list-none text-[15px] font-semibold text-ink marker:hidden">
                      <span className="mr-2 text-green-d group-open:hidden">+</span>
                      <span className="mr-2 hidden text-green-d group-open:inline">−</span>
                      {f.q}
                    </summary>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
