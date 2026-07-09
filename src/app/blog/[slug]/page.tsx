import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { SectionHead } from "@/components/SectionHead";
import { BlogCard, BlogImage } from "@/components/blog/BlogCard";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/mock-data";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
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

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

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
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <article className="mx-auto mt-4 max-w-[760px]">
            <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-green-d">
              {post.tag}
            </span>
            <h1 className="mt-2 text-[30px] font-bold leading-tight text-ink">
              {post.title}
            </h1>
            <p className="mt-2 text-[13px] text-muted">
              {post.readMinutes} phút đọc · {post.date}
            </p>

            <div className="mt-5 aspect-video overflow-hidden rounded-2xl">
              <BlogImage accent={post.accent} uid={`hero-${post.slug}`} />
            </div>

            <div className="mt-6 flex flex-col gap-4 text-[15.5px] leading-relaxed text-ink-2">
              <p className="text-[16px] font-medium text-ink">{post.excerpt}</p>
              {post.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-12">
              <SectionHead title="Bài viết liên quan" moreHref="/blog" />
              <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
