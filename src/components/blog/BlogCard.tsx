import Image from "next/image";
import Link from "next/link";
import type { BlogAccent, BlogPost } from "@/lib/types";
import { ClockIcon } from "@/components/icons";

// Ảnh + card bài viết dùng chung (khối blog ở trang chủ và trang /blog).

const BLOG_GRADIENT: Record<BlogAccent, [string, string]> = {
  green: ["#0B5E2C", "#063619"],
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

// Ảnh bìa bài viết: dùng ảnh thật (Cloudinary) nếu có, ngược lại hiện gradient.
// Đặt trong 1 phần tử có `position: relative` (để `fill` hoạt động).
export function BlogCover({
  image,
  accent,
  uid,
  alt = "",
  sizes = "(max-width: 900px) 100vw, 380px",
}: {
  image?: string;
  accent: BlogAccent;
  uid: string;
  alt?: string;
  sizes?: string;
}) {
  if (image) {
    return <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" />;
  }
  return <BlogImage accent={accent} uid={uid} />;
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="relative h-full w-full transition duration-300 group-hover:scale-[1.04]">
          <BlogCover
            image={post.image}
            accent={post.accent}
            uid={post.slug}
            alt={post.title}
          />
        </div>
        <span className="absolute left-3 top-3 z-[1] rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-green-d shadow-sm backdrop-blur">
          {post.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[15.5px] font-bold leading-[1.4] text-ink transition group-hover:text-green-d">
          {post.title}
        </h3>
        <small className="mt-3 flex items-center gap-1.5 text-[12.5px] text-muted">
          <ClockIcon className="h-3.5 w-3.5" />
          {post.readMinutes} phút đọc · {post.date}
        </small>
      </div>
    </Link>
  );
}
