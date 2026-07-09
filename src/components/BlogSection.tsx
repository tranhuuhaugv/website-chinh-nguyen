import type { BlogPost } from "@/lib/types";
import { Container } from "./Container";
import { SectionHead } from "./SectionHead";
import { BlogCard } from "./blog/BlogCard";

// Khối "Thủ thuật & tin công nghệ" ở trang chủ. Server Component.

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead title="Thủ thuật & tin công nghệ" moreHref="/blog" />
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
