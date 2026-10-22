import type { MetadataRoute } from "next";
import {
  getSitemapProducts,
  getSitemapPosts,
  getBrands,
  getCategories,
  getPolicyLinks,
} from "@/lib/data";
import { HIDDEN_CATEGORY_SLUGS } from "@/lib/site";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.com.vn";

// Tự sinh sitemap từ dữ liệu database (chỉ lấy slug + ngày sửa).
// lastModified dùng ngày THẬT (sản phẩm: updatedAt, bài viết: createdAt); trang
// không có ngày thì bỏ trống — ghi "now" cho mọi URL khiến Google bỏ qua trường này.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, brands, posts, policyLinks] = await Promise.all([
    getSitemapProducts(),
    getCategories(),
    getBrands(),
    getSitemapPosts(),
    getPolicyLinks(),
  ]);

  const productUrls = products.map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Danh mục + trang hãng (hãng có thể chưa có bản ghi danh mục riêng).
  const listSlugs = Array.from(
    new Set(
      [...categories.map((c) => c.slug), ...brands.map((b) => b.slug)].filter(
        (s) => !HIDDEN_CATEGORY_SLUGS.has(s),
      ),
    ),
  );
  const categoryUrls = listSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const postUrls = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    ...(p.createdAt ? { lastModified: p.createdAt } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Trang chủ đổi theo sản phẩm mới nhất.
  const latest = products.reduce<Date | null>(
    (max, p) => (p.updatedAt && (!max || p.updatedAt > max) ? p.updatedAt : max),
    null,
  );

  return [
    {
      url: SITE_URL,
      ...(latest ? { lastModified: latest } : {}),
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
      ...policyLinks.map((l) => l.href),
    ].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...categoryUrls,
    ...productUrls,
    ...postUrls,
  ];
}
