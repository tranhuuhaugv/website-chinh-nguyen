import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import Image from "next/image";
import { Band, SectionIntro } from "@/components/static/Band";
import { BlogCard, BlogCover } from "@/components/blog/BlogCard";
import { ClockIcon } from "@/components/icons";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/data";

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

  // Mục lục: các khối tiêu đề trong bài (kèm vị trí gốc để làm anchor).
  const headings = post.content
    .map((b, i) => ({ ...b, i }))
    .filter((b) => b.type === "heading");

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
            <div className="mx-auto max-w-[760px]">
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

        {/* Ảnh bìa */}
        <Container className="pt-8">
          <div className="relative mx-auto aspect-[16/7] max-w-[880px] overflow-hidden rounded-2xl shadow-card max-[600px]:aspect-video">
            <BlogCover
              image={post.image}
              accent={post.accent}
              uid={`hero-${post.slug}`}
              alt={post.title}
              sizes="(max-width: 900px) 100vw, 880px"
            />
          </div>
        </Container>

        {/* Nội dung */}
        <Band tone="white">
          <article className="mx-auto max-w-[720px]">
            <p className="border-l-[3px] border-green pl-5 text-[17px] font-medium leading-[1.7] text-ink">
              {post.excerpt}
            </p>

            {/* Mục lục — giúp khách xem tổng quan & nhảy tới từng mục */}
            {headings.length >= 2 && (
              <nav
                aria-label="Nội dung bài viết"
                className="mt-6 rounded-2xl border border-line bg-bg/60 p-5"
              >
                <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-green-d">
                  Nội dung bài viết
                </p>
                <ol className="flex flex-col gap-2">
                  {headings.map((h, n) => (
                    <li key={h.i}>
                      <a
                        href={`#muc-${h.i}`}
                        className="flex gap-2 text-[14.5px] leading-snug text-ink-2 transition hover:text-green-d"
                      >
                        <span className="font-semibold text-green-d">
                          {n + 1}.
                        </span>
                        <span>{h.value}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="mt-7 flex flex-col gap-5 text-[16.5px] leading-[1.85] text-ink-2">
              {post.content.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      id={`muc-${i}`}
                      className="mt-3 scroll-mt-24 text-[21px] font-bold leading-snug tracking-[-0.01em] text-ink"
                    >
                      {block.value}
                    </h2>
                  );
                }
                if (block.type === "image") {
                  return (
                    <figure key={i} className="my-2 overflow-hidden rounded-2xl">
                      <Image
                        src={block.value}
                        alt=""
                        width={1280}
                        height={720}
                        sizes="(max-width: 720px) 100vw, 720px"
                        className="h-auto w-full"
                      />
                    </figure>
                  );
                }
                return <p key={i}>{block.value}</p>;
              })}
            </div>
          </article>
        </Band>

        {/* Bài viết liên quan */}
        {related.length > 0 && (
          <Band tone="tint">
            <SectionIntro eyebrow="Đọc thêm" title="Bài viết liên quan" />
            <div className="mt-8 grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </Band>
        )}
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
