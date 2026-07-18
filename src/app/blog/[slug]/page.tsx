import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import Image from "next/image";
import { Band } from "@/components/static/Band";
import { BlogCover, BlogImage } from "@/components/blog/BlogCard";
import { ClockIcon, PhoneIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/data";
import { bocMucLuc } from "@/lib/rich-text";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  // Mục lục: bóc các tiêu đề trong bài + gắn id vào HTML để bấm nhảy tới.
  // HTML đã được lọc XSS ở tầng data (toRichHtml) + lúc lưu.
  const { html: noiDung, mucLuc: headings } = bocMucLuc(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.tag,
    url: `${SITE_URL}/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: "Laptop Chính Nguyễn" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero bài viết */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-green-tint via-white to-white">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-green-soft/50 blur-3xl" />
          <Container className="relative py-10 max-[600px]:py-8">
            {/* Cùng bề rộng 1120px với khối nội dung bên dưới để 2 khối thẳng mép trái */}
            <div className="mx-auto max-w-[1120px]">
              <Breadcrumb
                items={[
                  { label: "Trang chủ", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: post.title },
                ]}
              />
              <span className="mt-4 inline-block rounded-full bg-green-soft px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.05em] text-green-d">
                {post.tag}
              </span>
              <h1 className="mt-3 text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink max-[600px]:text-[26px]">
                {post.title}
              </h1>
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-muted">
                <ClockIcon className="h-4 w-4" />
                {post.readMinutes} phút đọc · {post.date}
              </p>
            </div>
          </Container>
        </section>

        {/* Nội dung: 2 cột — bài viết bên trái, cột phụ (mục lục/liên quan/tư vấn) bên phải */}
        <Band tone="white">
          <div className="mx-auto grid max-w-[1120px] grid-cols-[minmax(0,1fr)_320px] items-start gap-10 max-[1100px]:grid-cols-1">
            <article className="min-w-0">
              {/* Ảnh bìa: ảnh thật hiện TRỌN theo tỉ lệ gốc (không cắt mép banner);
                  chưa có ảnh thì dùng khung gradient tỉ lệ cố định. */}
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1600}
                  height={600}
                  priority
                  sizes="(max-width: 1100px) 100vw, 760px"
                  className="mb-7 h-auto w-full rounded-2xl shadow-card"
                />
              ) : (
                <div className="relative mb-7 aspect-[16/7] overflow-hidden rounded-2xl shadow-card max-[600px]:aspect-video">
                  <BlogImage accent={post.accent} uid={`hero-${post.slug}`} />
                </div>
              )}

              <p className="border-l-[3px] border-green pl-5 text-[17px] font-medium leading-[1.7] text-ink">
                {post.excerpt}
              </p>

              {/* Mục lục cho màn hình hẹp (cột phải bị dồn xuống dưới) */}
              {headings.length >= 2 && (
                <nav
                  aria-label="Nội dung bài viết"
                  className="mt-6 hidden rounded-2xl border border-line bg-bg/60 p-5 max-[1100px]:block"
                >
                  <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-d">
                    Nội dung bài viết
                  </p>
                  <ol className="flex flex-col gap-2">
                    {headings.map((h, n) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="flex gap-2 text-[14.5px] leading-snug text-ink-2 transition hover:text-green-d"
                        >
                          <span className="font-semibold text-green-d">
                            {n + 1}.
                          </span>
                          <span>{h.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div
                className="rich-text rich-text--blog mt-7"
                dangerouslySetInnerHTML={{ __html: noiDung }}
              />
            </article>

            {/* Cột phải sticky */}
            <aside className="flex flex-col gap-5 max-[1100px]:hidden min-[1101px]:sticky min-[1101px]:top-24">
              {headings.length >= 2 && (
                <nav
                  aria-label="Nội dung bài viết"
                  className="rounded-2xl border border-line bg-bg/60 p-5"
                >
                  <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-d">
                    Nội dung bài viết
                  </p>
                  <ol className="flex flex-col gap-2">
                    {headings.map((h, n) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="flex gap-2 text-[13.5px] leading-snug text-ink-2 transition hover:text-green-d"
                        >
                          <span className="font-semibold text-green-d">
                            {n + 1}.
                          </span>
                          <span>{h.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {related.length > 0 && (
                <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-d">
                    Bài viết liên quan
                  </p>
                  <div className="flex flex-col gap-4">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group flex items-start gap-3"
                      >
                        <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                          <BlogCover
                            image={p.image}
                            accent={p.accent}
                            uid={`side-${p.slug}`}
                            alt={p.title}
                            sizes="80px"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink transition group-hover:text-green-d">
                            {p.title}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-[12px] text-muted">
                            <ClockIcon className="h-3 w-3" />
                            {p.readMinutes} phút đọc
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hộp tư vấn / hotline */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-d to-green-dd p-5 text-white">
                <p className="text-[15px] font-bold leading-snug">
                  Cần tư vấn chọn laptop?
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
                  Gọi ngay để được tư vấn 1-1 miễn phí, chọn đúng máy đúng nhu
                  cầu.
                </p>
                <a
                  href={`tel:${SITE.hotlineTel}`}
                  className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-bold text-green-d transition hover:bg-green-soft"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {SITE.hotline}
                </a>
                <Link
                  href="/san-pham"
                  className="mt-2 flex h-10 items-center justify-center rounded-xl bg-white/[0.12] text-[13.5px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20"
                >
                  Xem laptop đang bán
                </Link>
              </div>
            </aside>
          </div>
        </Band>

        {/* Bài viết liên quan cho màn hình hẹp (cột phải bị ẩn) */}
        {related.length > 0 && (
          <div className="hidden max-[1100px]:block">
            <Band tone="tint">
              <p className="mb-5 text-[18px] font-extrabold text-ink">
                Bài viết liên quan
              </p>
              <div className="grid grid-cols-2 gap-5 max-[520px]:grid-cols-1">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                      <BlogCover
                        image={p.image}
                        accent={p.accent}
                        uid={`m-${p.slug}`}
                        alt={p.title}
                        sizes="80px"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink transition group-hover:text-green-d">
                        {p.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[12px] text-muted">
                        <ClockIcon className="h-3 w-3" />
                        {p.readMinutes} phút đọc
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </Band>
          </div>
        )}
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
