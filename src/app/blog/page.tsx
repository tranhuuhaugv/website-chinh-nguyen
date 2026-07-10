import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Thủ thuật & tin công nghệ",
  description:
    "Tư vấn chọn laptop, thủ thuật và tin công nghệ mới nhất từ Laptop Chính Nguyễn.",
};

export default async function BlogListPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Blog" }]}
          />
          <h1 className="mb-1 mt-3 text-[26px] font-bold text-ink">
            Thủ thuật &amp; tin công nghệ
          </h1>
          <p className="mb-6 text-[13.5px] text-muted">
            Tư vấn chọn máy, mẹo sử dụng và tin tức laptop mới nhất.
          </p>

          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
