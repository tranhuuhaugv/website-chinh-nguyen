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
  ALL_PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
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

const COMMITMENTS = [
  { icon: ShieldIcon, text: "Máy chính hãng, nguyên seal, đầy đủ hóa đơn VAT" },
  { icon: WarrantyIcon, text: "Bảo hành 24 tháng · 1 đổi 1 trong 30 ngày" },
  { icon: TruckIcon, text: "Giao nhanh 2h nội thành, toàn quốc 1-3 ngày" },
  { icon: InstallmentIcon, text: "Hỗ trợ trả góp 0% qua thẻ / công ty tài chính" },
];

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
      <span>{children}</span>
    </li>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const related = getRelatedProducts(product);

  const specs: [string, string][] = [
    ["Thương hiệu", product.brand],
    ["CPU", product.cpu],
    ["RAM", product.ram],
    ["Ổ cứng / Card", product.storage],
    ["Đánh giá", `${product.rating.toFixed(1)}/5 (${product.reviewCount} lượt)`],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: `${product.name} - ${product.cpu}, RAM ${product.ram}, ${product.storage}.`,
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
      url: `${SITE_URL}/san-pham/${product.slug}`,
    },
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
            <ProductGallery
              accent={product.accent}
              slug={product.slug}
              name={product.name}
              badge={
                product.isNew ? "Mới" : discount > 0 ? `-${discount}%` : undefined
              }
            />

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
              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
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
                    <span className="mt-1 inline-block rounded-full bg-sale/10 px-2 py-0.5 text-[12px] font-bold text-sale">
                      Tiết kiệm {discount}%
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
              </div>

              {/* Mua hàng */}
              <div className="mt-5">
                <ProductPurchase item={item} />
              </div>

              {/* Cam kết */}
              <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
                {COMMITMENTS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 text-[13px] text-ink-2"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
                      <Icon className="h-4 w-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Thông số + mô tả */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section>
              <SectionHead title="Thông số kỹ thuật" />
              <table className="w-full overflow-hidden rounded-xl border border-line text-[13.5px]">
                <tbody>
                  {specs.map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-white" : "bg-bg"}>
                      <td className="w-2/5 px-4 py-2.5 font-medium text-ink-2">
                        {k}
                      </td>
                      <td className="px-4 py-2.5 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <SectionHead title="Mô tả sản phẩm" />
              <div className="space-y-3 text-[14px] leading-relaxed text-ink-2">
                <p>
                  <b className="text-ink">{product.name}</b> là lựa chọn đáng cân
                  nhắc trong tầm giá với cấu hình {product.cpu}, RAM{" "}
                  {product.ram} và {product.storage}, đáp ứng tốt nhu cầu học
                  tập, làm việc và giải trí hằng ngày.
                </p>
                <p>
                  Máy chính hãng, nguyên seal, đầy đủ hóa đơn VAT, bảo hành 24
                  tháng tại Laptop Chính Nguyễn. Hỗ trợ trả góp 0% và giao hàng
                  nhanh toàn quốc.
                </p>
              </div>
            </section>
          </div>

          {/* Sản phẩm tương tự */}
          {related.length > 0 && (
            <section className="mt-10">
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
