import type { BlogPost } from "@/lib/types";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { BlogCard } from "./blog/BlogCard";

// Khối "Thủ thuật & tin công nghệ" ở trang chủ. Server Component.

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead
          title="Thủ thuật & tin công nghệ"
          subtitle="Tư vấn chọn máy, mẹo dùng và tin công nghệ mới nhất"
          moreHref="/blog"
        />
        <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {posts.slice(0, 4).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
