import Link from "next/link";
import type { BlogAccent, BlogPost } from "@/lib/types";

// Ảnh + card bài viết dùng chung (khối blog ở trang chủ và trang /blog).

const BLOG_GRADIENT: Record<BlogAccent, [string, string]> = {
  green: ["#159A48", "#0B5E2C"],
  blue: ["#1E88C9", "#0E5A94"],
  purple: ["#7A4BC9", "#4A2A85"],
};

export function BlogImage({
  accent,
  uid,
}: {
  accent: BlogAccent;
  uid: string;
}) {
  const [from, to] = BLOG_GRADIENT[accent];
  const id = `blog-${uid}`;
  return (
    <svg
      viewBox="0 0 380 214"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="380" height="214" fill={`url(#${id})`} />
      <circle cx="330" cy="30" r="70" fill="#ffffff" opacity="0.07" />
      <rect x="70" y="95" width="105" height="70" rx="8" fill="#ffffff" opacity="0.9" />
      <rect x="205" y="95" width="105" height="70" rx="8" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-white transition duration-150 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(21,154,72,0.1)]"
    >
      <div className="aspect-video">
        <BlogImage accent={post.accent} uid={post.slug} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-green-d">
          {post.tag}
        </span>
        <h3 className="my-[7px] text-[15px] font-semibold leading-[1.4] text-ink">
          {post.title}
        </h3>
        <small className="mt-auto text-[12.5px] text-muted">
          {post.readMinutes} phút đọc · {post.date}
        </small>
      </div>
    </Link>
  );
}
