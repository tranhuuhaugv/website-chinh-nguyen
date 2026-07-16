import type { Metadata } from "next";
import Image from "next/image";
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
import { ProductVariants } from "@/components/product/ProductVariants";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { StarIcon } from "@/components/icons";
import { CommitmentCards } from "@/components/product/CommitmentCards";
import {
  getAllProductSlugs,
  getProductBySlug,
  getProductVariants,
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

  // Mô tả SEO theo dữ liệu thật + đúng tình trạng máy (không hứa "chính hãng" với máy cũ).
  const used = (product.condition ?? "used") === "used";
  const description = `${product.name} - ${product.cpu}, RAM ${product.ram}, ${product.storage}. Giá ${formatPrice(
    product.price,
  )} tại Laptop Chính Nguyễn (Đà Nẵng). ${
    used
      ? "Máy đã qua sử dụng, kiểm tra kỹ, bảo hành tại shop, đổi trả 7 ngày."
      : "Máy mới nguyên seal, bảo hành chính hãng, giao nhanh toàn quốc."
  }`;
  const url = `${SITE_URL}/san-pham/${product.slug}`;
  // Ảnh thật -> URL tuyệt đối để Facebook/Zalo hiện ảnh khi share.
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

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Máy cũ / máy mới -> nội dung bảo hành, cam kết khác nhau (không hứa sai).
  const isUsed = (product.condition ?? "used") === "used";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;
  // Song song: 2 truy vấn độc lập nhau, không cộng dồn độ trễ.
  const [related, variants] = await Promise.all([
    getRelatedProducts(product),
    getProductVariants(product),
  ]);

  const url = `${SITE_URL}/san-pham/${product.slug}`;
  const specGroups = buildSpecGroups(product);
  const description = buildDescription(product);
  // Mô tả admin tự soạn (kèm ảnh thật). Chưa soạn -> dùng mô tả tự sinh ở trên.
  const ownDescription = product.description ?? [];
  // Schema.org: ưu tiên chữ admin viết, không có thì lấy câu đầu của mô tả tự sinh.
  const ldDescription =
    ownDescription.find((b) => b.type === "text")?.value ??
    description[0].paragraphs[0];

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
          // Khai báo đúng tình trạng máy: máy cũ KHÔNG được báo Google là hàng mới.
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
                images={product.images}
                badge={
                  product.isNew
                    ? "Mới"
                    : discount > 0
                      ? `-${discount}%`
                      : undefined
                }
              />

              {/* Cam kết — ngay dưới ảnh (không ghim đáy để khỏi hở khoảng trên) */}
              <div className="mt-4 max-lg:hidden">
                <CommitmentCards condition={product.condition} />
              </div>
            </div>

            <div className="flex flex-col">
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
                  {isUsed
                    ? "Đã kiểm tra kỹ · Bảo hành tại shop"
                    : "Máy mới · Bảo hành chính hãng 24 tháng"}
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

              {/* Chọn cấu hình khác (máy cùng dòng admin đã nối link) */}
              <ProductVariants options={variants} currentSlug={product.slug} />

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
                    Đổi trả trong <b className="text-ink">7 ngày</b> · miễn phí cài
                    đặt phần mềm.
                  </Bullet>
                </ul>

                {/* Cam kết — chỉ hiện MOBILE (gộp vào box ưu đãi, để giá lên trên) */}
                <div className="mt-3 border-t border-green/20 pt-3 lg:hidden">
                  <CommitmentCards condition={product.condition} />
                </div>
              </div>

              {/* Mua hàng — ghim xuống đáy cột để ngang hàng khối cam kết bên trái */}
              <div className="mt-auto pt-5">
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
            {ownDescription.length > 0 ? (
              // Mô tả admin tự soạn (kèm ảnh thật của chính chiếc máy này).
              <article className="mt-4 flex max-w-[780px] flex-col gap-4">
                {ownDescription.map((block, i) => {
                  if (block.type === "heading") {
                    return (
                      <h3 key={i} className="text-[16px] font-bold text-ink">
                        {block.value}
                      </h3>
                    );
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={i} className="overflow-hidden rounded-2xl">
                        <Image
                          src={block.value}
                          alt={`${product.name} - ảnh thực tế`}
                          width={1280}
                          height={960}
                          sizes="(max-width: 820px) 100vw, 780px"
                          className="h-auto w-full"
                        />
                      </figure>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-[14.5px] leading-relaxed text-ink-2"
                    >
                      {block.value}
                    </p>
                  );
                })}
              </article>
            ) : (
              // Chưa soạn mô tả -> tự sinh theo thông số máy.
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
