import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllPostSlugs, getCategories } from "@/lib/data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

// Tự sinh sitemap từ dữ liệu database (chỉ lấy slug).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [productSlugs, categories, postSlugs] = await Promise.all([
    getAllProductSlugs(),
    getCategories(),
    getAllPostSlugs(),
  ]);

  const products = productSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const posts = postSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
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
      "/san-pham",
      "/build-pc",
      "/blog",
      "/gioi-thieu",
      "/lien-he",
      "/he-thong-cua-hang",
      "/thu-cu-doi-moi",
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
    ...categoryUrls,
    ...products,
    ...posts,
  ];
}
