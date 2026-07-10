import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { BlogCard, BlogImage } from "@/components/blog/BlogCard";
import { ClockIcon } from "@/components/icons";
import { getBlogPosts } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Thủ thuật & tin công nghệ",
  description:
    "Tư vấn chọn laptop, thủ thuật và tin công nghệ mới nhất từ Laptop Chính Nguyễn.",
};

export default async function BlogListPage() {
  const posts = await getBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <StaticPage
      title="Thủ thuật & tin công nghệ"
      lead="Tư vấn chọn máy, mẹo sử dụng và tin tức laptop mới nhất — được biên soạn bởi đội ngũ Chính Nguyễn."
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Blog" }]}
    >
      {posts.length === 0 ? (
        <Band tone="white">
          <p className="py-10 text-center text-muted">
            Chưa có bài viết nào.
          </p>
        </Band>
      ) : (
        <>
          {/* Bài viết nổi bật */}
          <Band tone="white">
            <SectionIntro eyebrow="Nổi bật" title="Bài viết mới nhất" />
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-8 grid overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-200 hover:shadow-card-hover md:grid-cols-2"
            >
              <div className="relative aspect-video overflow-hidden md:aspect-auto">
                <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
                  <BlogImage accent={featured.accent} uid={`feat-${featured.slug}`} />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em] text-green-d shadow-sm backdrop-blur">
                  {featured.tag}
                </span>
              </div>
              <div className="flex flex-col justify-center gap-3 p-7 max-[600px]:p-5">
                <h3 className="text-[24px] font-extrabold leading-[1.2] tracking-[-0.01em] text-ink transition group-hover:text-green-d max-[600px]:text-[20px]">
                  {featured.title}
                </h3>
                <p className="line-clamp-3 text-[14.5px] leading-relaxed text-ink-2">
                  {featured.excerpt}
                </p>
                <small className="flex items-center gap-1.5 text-[12.5px] text-muted">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {featured.readMinutes} phút đọc · {featured.date}
                </small>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-green-d">
                  Đọc bài viết →
                </span>
              </div>
            </Link>
          </Band>

          {/* Danh sách còn lại */}
          {rest.length > 0 && (
            <Band tone="tint">
              <SectionIntro eyebrow="Tất cả bài viết" title="Khám phá thêm" />
              <div className="mt-8 grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </Band>
          )}
        </>
      )}
    </StaticPage>
  );
}
