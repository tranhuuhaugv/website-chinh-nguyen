import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { MobileBuyBar } from "@/components/product/MobileBuyBar";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { FlashSlider } from "@/components/FlashSlider";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/SectionHead";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductVariants } from "@/components/product/ProductVariants";
import {
  ProductOptionProvider,
  ProductPrice,
  ProductOptionPicker,
} from "@/components/product/ProductOptions";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { MapPinIcon, StarIcon } from "@/components/icons";
import { CommitmentCards } from "@/components/product/CommitmentCards";
import { SITE } from "@/lib/site";
import {
  getProductBySlug,
  getProductVariants,
  getRelatedProducts,
  getStores,
} from "@/lib/data";
import type { Product } from "@/lib/types";
import { buildDescription, buildSpecGroups } from "@/lib/product-content";
import { richTextToText } from "@/lib/rich-text";
import { formatPrice } from "@/lib/format";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Metadata trang sản phẩm (route gốc /[slug] gọi khi slug là sản phẩm).
export function buildProductMetadata(product: Product): Metadata {
  const used = (product.condition ?? "used") === "used";
  const description = `${product.name} - ${product.cpu}, RAM ${product.ram}, ${product.storage}. Giá ${formatPrice(
    product.price,
  )} tại Laptop Chính Nguyễn (Đà Nẵng). ${
    used
      ? "Máy đã qua sử dụng, kiểm tra kỹ, bảo hành tại shop, dùng thử 15 ngày, 1 đổi 1 trong 30 ngày."
      : "Máy mới nguyên seal, bảo hành chính hãng, giao nhanh toàn quốc."
  }`;
  const url = `${SITE_URL}/${product.slug}`;
  const ogImages = (product.images ?? []).map((i) => `${SITE_URL}${i}`);
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website",
      ...(ogImages.length ? { images: ogImages } : {}),
    },
  };
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
      <span>{children}</span>
    </li>
  );
}

export async function ProductDetailView({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isUsed = (product.condition ?? "used") === "used";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  // Tình trạng hàng -> nhãn + màu badge.
  const STOCK: Record<string, { label: string; cls: string; dot: string }> = {
    con_hang: {
      label: "Còn hàng",
      cls: "bg-green-soft text-green-d",
      dot: "bg-green",
    },
    het_hang: { label: "Hết hàng", cls: "bg-sale/10 text-sale", dot: "bg-sale" },
    sap_ve: {
      label: "Sắp về hàng",
      cls: "bg-amber/15 text-[#B8860B]",
      dot: "bg-amber",
    },
  };
  const stock = STOCK[product.stockStatus ?? "con_hang"] ?? STOCK.con_hang;
  // Chỉ CÒN HÀNG mới cho mua; hết hàng / sắp về -> khoá nút mua.
  const available = (product.stockStatus ?? "con_hang") === "con_hang";

  // Tùy chọn cấu hình: nếu admin có nhập option -> đưa CẤU HÌNH GỐC (giá gốc)
  // lên làm ô ĐẦU TIÊN (chọn sẵn), rồi các option admin ở dưới. Không có option
  // admin -> danh sách rỗng (hiện 1 giá như thường).
  const capLabel =
    product.capacity?.trim() ||
    [product.ram, product.storage].filter(Boolean).join(" - ").trim();
  const configOptions =
    product.options && product.options.length > 0
      ? [{ label: capLabel || "Mặc định", price: product.price }, ...product.options]
      : [];
  const [related, variants, stores] = await Promise.all([
    getRelatedProducts(product, 12),
    getProductVariants(product),
    getStores(),
  ]);

  const url = `${SITE_URL}/${product.slug}`;
  const specGroups = buildSpecGroups(product);
  const description = buildDescription(product);
  const ownDescription = product.description ?? "";
  const ldDescription =
    richTextToText(ownDescription).slice(0, 300) || description[0].paragraphs[0];
  const brandUrl = `${SITE_URL}/${product.brand.toLowerCase()}`;
  const brandHref = `/${product.brand.toLowerCase()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        brand: { "@type": "Brand", name: product.brand },
        category: `Laptop ${product.brand}`,
        sku: product.id,
        ...(product.images?.length
          ? { image: product.images.map((i) => `${SITE_URL}${i}`) }
          : {}),
        description: ldDescription,
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
          itemCondition: isUsed
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
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
            item: brandUrl,
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
      <ProductOptionProvider options={configOptions} basePrice={product.price}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="py-6 max-lg:pb-24">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: product.brand, href: brandHref },
              { label: product.name },
            ]}
          />

          <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <ProductGallery
                accent={product.accent}
                slug={product.slug}
                name={product.name}
                images={product.images}
              />

              <div className="mt-4 max-lg:hidden">
                <CommitmentCards condition={product.condition} />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[21px] font-bold leading-snug text-ink max-[640px]:text-[18px]">
                {product.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="flex gap-px text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                <span className="text-muted">
                  {isUsed
                    ? "Đã kiểm tra kỹ · Bảo hành tại shop"
                    : "Máy mới · Bảo hành chính hãng 24 tháng"}
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <div
                  className={`flex items-center justify-between gap-4 p-4 ${
                    discount > 0
                      ? "bg-gradient-to-r from-[#FFF6F5] to-white"
                      : "bg-white"
                  }`}
                >
                  <ProductPrice oldPrice={product.oldPrice} discount={discount} />
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Tình trạng
                    </p>
                    <p
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${stock.cls}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
                      {stock.label}
                    </p>
                  </div>
                </div>
              </div>

              <ProductOptionPicker />

              <ProductVariants options={variants} currentSlug={product.slug} />

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
                    {isUsed ? (
                      <>
                        <b className="text-ink">Bảo hành tại shop</b> + kiểm tra
                        máy trực tiếp khi nhận.
                      </>
                    ) : (
                      <>
                        Bảo hành <b className="text-ink">24 tháng</b> + kiểm tra
                        máy trực tiếp khi nhận.
                      </>
                    )}
                  </Bullet>
                  <Bullet>
                    <b className="text-ink">Dùng thử 15 ngày</b> · 1 đổi 1 trong 30
                    ngày nếu lỗi · miễn phí cài đặt phần mềm.
                  </Bullet>
                </ul>

                <div className="mt-3 border-t border-green/20 pt-3 lg:hidden">
                  <CommitmentCards condition={product.condition} />
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-line bg-white p-4 max-lg:hidden">
                <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                  <MapPinIcon className="h-[18px] w-[18px] shrink-0 text-green" />
                  Xem &amp; nhận máy tại cửa hàng
                </p>
                <ul className="mt-2.5 flex flex-col gap-2.5">
                  {stores.map((s) => (
                    <li
                      key={s.address}
                      className="flex gap-2 text-[12.5px] leading-snug text-ink-2"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                      <span>
                        <b className="text-ink">{s.name}</b>
                        <br />
                        {s.address}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 border-t border-line pt-2.5 text-[12px] text-muted">
                  Giờ mở cửa: {SITE.hours}
                </p>
              </div>

              <div className="mt-auto pt-5">
                <ProductPurchase
                  item={item}
                  available={available}
                  unavailableLabel={stock.label}
                />
              </div>
            </div>
          </div>

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

          <section
            id="mo-ta"
            className="mt-6 scroll-mt-20 rounded-2xl border border-line bg-white p-6 lg:p-8"
          >
            <h2 className="text-[20px] font-bold text-ink">Mô tả sản phẩm</h2>
            {ownDescription ? (
              <article
                className="rich-text mt-4"
                dangerouslySetInnerHTML={{ __html: ownDescription }}
              />
            ) : (
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
            )}
          </section>

          <section
            id="thong-so"
            className="mt-6 scroll-mt-20 rounded-2xl border border-line bg-white p-6 lg:p-8"
          >
            <h2 className="text-[20px] font-bold text-ink">Thông số kỹ thuật</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6">
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
                          <td className="whitespace-pre-line py-2.5 font-medium text-ink">
                            {v}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section id="tuong-tu" className="mt-10 scroll-mt-20">
              <SectionHead title="Sản phẩm tương tự" moreHref="/san-pham" />
              <FlashSlider>
                {related.map((p) => (
                  <div
                    key={p.id}
                    className="w-[240px] shrink-0 max-[640px]:w-[170px]"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </FlashSlider>
            </section>
          )}

          <RecentlyViewed
            current={{
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images?.[0],
            }}
          />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <MobileBuyBar
        item={item}
        price={product.price}
        oldPrice={product.oldPrice}
        available={available}
        unavailableLabel={stock.label}
      />
      <CompareBar />
      </ProductOptionProvider>
    </CompareProvider>
  );
}
