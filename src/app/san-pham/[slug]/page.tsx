import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/SectionHead";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import {
  InstallmentIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
  WarrantyIcon,
} from "@/components/icons";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data";
import { buildDescription, buildSpecGroups } from "@/lib/product-content";
import { formatPrice } from "@/lib/format";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  const description = `${product.name} - ${product.cpu}, RAM ${product.ram}, ${product.storage}. Giá ${formatPrice(
    product.price,
  )} tại Laptop Chính Nguyễn. Chính hãng, trả góp 0%, bảo hành 24 tháng.`;
  const url = `${SITE_URL}/san-pham/${product.slug}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: { title: product.name, description, url, type: "website" },
  };
}

// Cam kết theo tình trạng máy (mới / cũ) — nội dung khớp thực tế shop bán.
function commitmentsFor(condition?: string) {
  if (condition === "new") {
    return [
      { icon: ShieldIcon, text: "Máy chính hãng, nguyên seal, đầy đủ hóa đơn VAT" },
      { icon: WarrantyIcon, text: "Bảo hành chính hãng · 1 đổi 1 trong 30 ngày" },
      { icon: TruckIcon, text: "Giao nhanh 2h nội thành, toàn quốc 1-3 ngày" },
      { icon: InstallmentIcon, text: "Hỗ trợ trả góp 0% qua thẻ / công ty tài chính" },
    ];
  }
  return [
    { icon: ShieldIcon, text: "Máy đã kiểm tra kỹ, test đầy đủ chức năng" },
    { icon: WarrantyIcon, text: "Bảo hành shop · hỗ trợ kỹ thuật tận nơi" },
    { icon: TruckIcon, text: "Giao nhanh 2h nội thành, toàn quốc 1-3 ngày" },
    { icon: InstallmentIcon, text: "Trả góp 0% · thu cũ đổi mới lên đời" },
  ];
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
      <span>{children}</span>
    </li>
  );
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;
  const related = await getRelatedProducts(product);

  const url = `${SITE_URL}/san-pham/${product.slug}`;
  const specGroups = buildSpecGroups(product);
  const description = buildDescription(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        brand: { "@type": "Brand", name: product.brand },
        category: `Laptop ${product.brand}`,
        sku: product.id,
        description: description[0].paragraphs[0],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url,
          seller: { "@type": "Organization", name: "Laptop Chính Nguyễn" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: product.brand,
            item: `${SITE_URL}/danh-muc/${product.brand.toLowerCase()}`,
          },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };

  const item = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    accent: product.accent,
  };

  return (
    <CompareProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              {
                label: product.brand,
                href: `/danh-muc/${product.brand.toLowerCase()}`,
              },
              { label: product.name },
            ]}
          />

          <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <ProductGallery
                accent={product.accent}
                slug={product.slug}
                name={product.name}
                badge={
                  product.isNew
                    ? "Mới"
                    : discount > 0
                      ? `-${discount}%`
                      : undefined
                }
              />

              {/* Cam kết — dưới ảnh (chỉ DESKTOP; mobile gộp vào box Ưu đãi bên dưới) */}
              <ul className="mt-5 flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5 max-lg:hidden">
                {commitmentsFor(product.condition).map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 text-[13.5px] leading-snug text-ink-2"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h1 className="text-[28px] font-bold leading-tight text-ink">
                {product.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="flex gap-px text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                <span className="text-muted">
                  Đã kiểm tra kỹ · Còn bảo hành 24 tháng
                </span>
              </div>

              {/* Box giá + tình trạng */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <div
                  className={`flex items-center justify-between gap-4 p-4 ${
                    discount > 0
                      ? "bg-gradient-to-r from-[#FFF6F5] to-white"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[28px] font-extrabold text-sale">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-[15px] text-muted line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="mt-1.5 inline-block rounded-full bg-sale px-2.5 py-0.5 text-[12px] font-bold text-white">
                        Giảm {discount}% · tiết kiệm {formatPrice(savings)}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Tình trạng
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-soft px-2.5 py-1 text-[12px] font-semibold text-green-d">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      Còn hàng
                    </p>
                  </div>
                </div>
              </div>

              {/* Cấu hình */}
              <div className="mt-5">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
                  Cấu hình
                </p>
                <div className="flex flex-wrap gap-2">
                  {[product.cpu, product.ram, product.storage].map((s) => (
                    <span
                      key={s}
                      className="rounded-xl border border-green bg-green-tint px-4 py-2 text-[13px] font-semibold text-green-d"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ưu đãi */}
              <div className="mt-5 rounded-2xl border border-green/30 bg-green-tint/50 p-4">
                <p className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-green-d">
                  Ưu đãi tại Chính Nguyễn
                </p>
                <ul className="flex flex-col gap-2 text-[13px] text-ink-2">
                  {product.gift && (
                    <Bullet>
                      Tặng <b className="text-ink">{product.gift}</b> khi mua
                      trong hôm nay.
                    </Bullet>
                  )}
                  <Bullet>
                    Thu cũ đổi mới:{" "}
                    <b className="text-ink">trợ giá đến 3.000.000₫</b> khi lên
                    đời.
                  </Bullet>
                  {product.installmentPerMonth && (
                    <Bullet>
                      Trả góp 0% · chỉ từ{" "}
                      <b className="text-ink">
                        {formatPrice(product.installmentPerMonth)}
                      </b>
                      /tháng.
                    </Bullet>
                  )}
                  <Bullet>
                    Bảo hành <b className="text-ink">24 tháng</b> + kiểm tra máy
                    trực tiếp khi nhận.
                  </Bullet>
                </ul>

                {/* Cam kết — chỉ hiện MOBILE (gộp vào box ưu đãi, để giá lên trên) */}
                <ul className="mt-3 flex flex-col gap-3 border-t border-green/20 pt-3 lg:hidden">
                  {commitmentsFor(product.condition).map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-start gap-3 text-[13px] leading-snug text-ink-2"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-green">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="pt-0.5">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mua hàng */}
              <div className="mt-5">
                <ProductPurchase item={item} />
              </div>
            </div>
          </div>

          {/* Thanh điều hướng nhanh trong trang */}
          <nav className="sticky top-0 z-20 mt-10 flex gap-1 overflow-x-auto border-b border-line bg-bg/90 backdrop-blur">
            {[
              { href: "#mo-ta", label: "Mô tả sản phẩm" },
              { href: "#thong-so", label: "Thông số kỹ thuật" },
              { href: "#tuong-tu", label: "Sản phẩm tương tự" },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-[13.5px] font-medium text-ink-2 transition hover:border-green hover:text-green-d"
              >
                {t.label}
              </a>
            ))}
          </nav>

          {/* Mô tả sản phẩm (bài viết dài) */}
          <section
            id="mo-ta"
            className="mt-6 scroll-mt-20 rounded-2xl border border-line bg-white p-6 lg:p-8"
          >
            <h2 className="text-[20px] font-bold text-ink">Mô tả sản phẩm</h2>
            <article className="mt-4 flex max-w-[780px] flex-col gap-6">
              {description.map((sec) => (
                <div key={sec.heading}>
                  <h3 className="text-[16px] font-bold text-ink">
                    {sec.heading}
                  </h3>
                  {sec.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="mt-2 text-[14.5px] leading-relaxed text-ink-2"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </article>
          </section>

          {/* Thông số kỹ thuật theo nhóm */}
          <section
            id="thong-so"
            className="mt-6 scroll-mt-20 rounded-2xl border border-line bg-white p-6 lg:p-8"
          >
            <h2 className="text-[20px] font-bold text-ink">
              Thông số kỹ thuật
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {specGroups.map((group) => (
                <div key={group.group}>
                  <h3 className="mb-2 flex items-center gap-2 text-[14px] font-bold text-green-d">
                    <span className="h-4 w-1 rounded bg-green" />
                    {group.group}
                  </h3>
                  <table className="w-full text-[13.5px]">
                    <tbody>
                      {group.rows.map(([k, v]) => (
                        <tr
                          key={k}
                          className="border-b border-line last:border-0"
                        >
                          <td className="w-[42%] py-2.5 pr-3 align-top text-ink-2">
                            {k}
                          </td>
                          <td className="py-2.5 font-medium text-ink">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          {/* Sản phẩm tương tự */}
          {related.length > 0 && (
            <section id="tuong-tu" className="mt-10 scroll-mt-20">
              <SectionHead title="Sản phẩm tương tự" moreHref="/san-pham" />
              <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[460px]:gap-2.5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
