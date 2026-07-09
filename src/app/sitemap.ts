import type { MetadataRoute } from "next";
import {
  BLOG_POSTS,
  CATEGORIES,
  FEATURED_PRODUCTS,
  FLASH_SALE_PRODUCTS,
} from "@/lib/mock-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Tự sinh sitemap từ dữ liệu. Khi có DB, thay các mảng mock bằng query Prisma
// (chỉ select slug + updatedAt, có phân trang nếu dữ liệu lớn).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const products = [...FLASH_SALE_PRODUCTS, ...FEATURED_PRODUCTS].map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categories = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/danh-muc/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const posts = BLOG_POSTS.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...[
      "/blog",
      "/gioi-thieu",
      "/lien-he",
      "/he-thong-cua-hang",
      "/tuyen-dung",
      "/chinh-sach/bao-hanh",
      "/chinh-sach/doi-tra",
      "/chinh-sach/giao-hang",
      "/chinh-sach/tra-gop",
    ].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...categories,
    ...products,
    ...posts,
  ];
}
