import { prisma } from "./prisma";
import type {
  BannerItem,
  BlogAccent,
  BlogBlock,
  BlogPost,
  Brand,
  Category,
  CategoryIconName,
  CustomerPhoto,
  Product,
  ProductAccent,
} from "./types";
import type { Policy, Section } from "./policies";
import {
  ALL_PRODUCTS,
  BLOG_POSTS,
  CATEGORIES,
  CUSTOMER_PHOTOS,
  FEATURED_PRODUCTS,
  FLASH_SALE_PRODUCTS,
} from "./mock-data";

// Lớp truy vấn database (Prisma) cho các trang khách hàng.
// Trả về đúng shape mà component đang dùng (không phải sửa component).

// Chế độ xem local KHÔNG cần database: khi máy chưa cấu hình DATABASE_URL,
// tự trả về dữ liệu mock để `npm run dev` xem được giao diện ngay.
// Trên production (VPS có DATABASE_URL) cờ này = false -> luôn dùng DB thật.
const NO_DB = !process.env.DATABASE_URL;

// Gộp mọi sản phẩm mock (khử trùng theo slug) để tra cứu chi tiết khi NO_DB.
const MOCK_PRODUCTS: Product[] = Array.from(
  new Map(
    [...ALL_PRODUCTS, ...FEATURED_PRODUCTS, ...FLASH_SALE_PRODUCTS].map((p) => [
      p.slug,
      p,
    ]),
  ).values(),
);

type PrismaProductWithBrand = Awaited<
  ReturnType<typeof prisma.product.findFirst>
> & { brand: { name: string } };

function toProduct(p: PrismaProductWithBrand): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand.name as Brand,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    cpu: p.cpu,
    ram: p.ram,
    storage: p.storage,
    rating: p.rating,
    reviewCount: p.reviewCount,
    installmentPerMonth: p.installmentPerMonth ?? undefined,
    gift: p.gift ?? undefined,
    badge: p.badge ?? undefined,
    isNew: p.isNew,
    accent: p.accent as ProductAccent,
  };
}

// Chuẩn hoá content (Json trong DB) về mảng khối. Hỗ trợ cả dữ liệu cũ
// (mảng chuỗi = các đoạn văn) lẫn dữ liệu mới (mảng khối {type, value}).
function toBlocks(raw: unknown): BlogBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((b): BlogBlock => {
      if (typeof b === "string") return { type: "text", value: b };
      if (b && typeof b === "object") {
        const o = b as { type?: unknown; value?: unknown };
        const type =
          o.type === "heading" || o.type === "image" ? o.type : "text";
        return { type, value: String(o.value ?? "") };
      }
      return { type: "text", value: "" };
    })
    .filter((b) => b.value);
}

function toPost(b: {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  content: unknown;
  readMinutes: number;
  accent: string;
  date: string;
  image?: string | null;
}): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    tag: b.tag,
    excerpt: b.excerpt,
    image: b.image ?? undefined,
    content: toBlocks(b.content),
    readMinutes: b.readMinutes,
    accent: b.accent as BlogAccent,
    date: b.date,
  };
}

const withBrand = { include: { brand: true } } as const;

// --- Sản phẩm ---
export async function getAllProducts(): Promise<Product[]> {
  if (NO_DB) return MOCK_PRODUCTS;
  const rows = await prisma.product.findMany({
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  if (NO_DB) return FLASH_SALE_PRODUCTS;
  const rows = await prisma.product.findMany({
    where: { isFlashSale: true },
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (NO_DB) return FEATURED_PRODUCTS;
  const rows = await prisma.product.findMany({
    where: { isFlashSale: false },
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (NO_DB) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const row = await prisma.product.findUnique({ where: { slug }, ...withBrand });
  return row ? toProduct(row as PrismaProductWithBrand) : null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const mapped = NO_DB
    ? MOCK_PRODUCTS.filter((p) => p.slug !== product.slug)
    : (
        await prisma.product.findMany({
          where: { slug: { not: product.slug } },
          ...withBrand,
          orderBy: { sort: "asc" },
        })
      ).map((r) => toProduct(r as PrismaProductWithBrand));
  const sameBrand = mapped.filter((p) => p.brand === product.brand);
  const others = mapped.filter((p) => p.brand !== product.brand);
  return [...sameBrand, ...others].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (NO_DB) return MOCK_PRODUCTS.map((p) => p.slug);
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

// Gợi ý sản phẩm theo từ khoá (dùng cho autocomplete ô tìm kiếm).
export async function searchProducts(q: string, limit = 6): Promise<Product[]> {
  const term = q.trim();
  if (!term) return [];
  if (NO_DB) {
    const low = term.toLowerCase();
    return MOCK_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(low),
    ).slice(0, limit);
  }
  const rows = await prisma.product.findMany({
    where: { name: { contains: term, mode: "insensitive" } },
    ...withBrand,
    orderBy: { sort: "asc" },
    take: limit,
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

// --- Danh mục ---
export async function getCategories(): Promise<Category[]> {
  if (NO_DB) return CATEGORIES;
  const rows = await prisma.category.findMany({ orderBy: { sort: "asc" } });
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon as CategoryIconName,
    tag: c.tag ?? undefined,
    image: c.image ?? undefined,
  }));
}

export async function getCategoryName(slug: string): Promise<string | null> {
  if (NO_DB) return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
  const c = await prisma.category.findUnique({ where: { slug } });
  return c?.name ?? null;
}

export async function getBrandBySlug(slug: string): Promise<string | null> {
  if (NO_DB) {
    const p = MOCK_PRODUCTS.find((x) => x.brand.toLowerCase() === slug);
    return p?.brand ?? null;
  }
  const b = await prisma.brand.findUnique({ where: { slug } });
  return b?.name ?? null;
}

// --- Blog ---
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (NO_DB) return BLOG_POSTS;
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (NO_DB) return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  return row ? toPost(row) : null;
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  if (NO_DB)
    return BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, limit);
  const rows = await prisma.blogPost.findMany({
    where: { slug: { not: post.slug } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toPost);
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (NO_DB) return BLOG_POSTS.map((p) => p.slug);
  const rows = await prisma.blogPost.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

// --- Trang chính sách (nội dung sửa qua admin, ghi đè bản mặc định) ---
export async function getPolicyOverride(
  slug: string,
): Promise<Policy | null> {
  if (NO_DB) return null;
  try {
    const page = await prisma.page.findUnique({ where: { id: slug } });
    if (!page) return null;
    const content =
      (page.content as { intro?: string[]; sections?: Section[] } | null) ?? {};
    return {
      title: page.title,
      lead: page.lead ?? "",
      intro: Array.isArray(content.intro) ? content.intro : [],
      sections: Array.isArray(content.sections) ? content.sections : [],
    };
  } catch {
    return null;
  }
}

// --- Đơn hàng (admin) ---
export async function getOrders() {
  if (NO_DB) return [];
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

// Đơn hàng của 1 khách (cho trang "Đơn hàng của tôi").
export async function getUserOrders(userId: string) {
  if (NO_DB) return [];
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// --- Tài khoản quản trị (admin) ---
export async function getAdminUsers() {
  if (NO_DB) return [];
  return prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

// --- Tài khoản khách hàng (user) ---
const CUSTOMERS_PER_PAGE = 20;

export async function getCustomerUsers(page = 1) {
  if (NO_DB) return { users: [], total: 0, totalPages: 0 };
  const skip = (page - 1) * CUSTOMERS_PER_PAGE;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: CUSTOMERS_PER_PAGE,
    }),
    prisma.user.count({ where: { role: "user" } }),
  ]);
  return { users, total, totalPages: Math.ceil(total / CUSTOMERS_PER_PAGE) };
}

// --- Ảnh khách hàng (lưu danh sách URL trong Setting "customerPhotos") ---
export async function getCustomerPhotoUrls(): Promise<string[]> {
  if (NO_DB) return [];
  const s = await prisma.setting.findUnique({
    where: { key: "customerPhotos" },
  });
  try {
    const parsed = s ? JSON.parse(s.value) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getCustomerPhotos(): Promise<CustomerPhoto[]> {
  const urls = await getCustomerPhotoUrls();
  if (!urls.length) return CUSTOMER_PHOTOS; // chưa cấu hình -> dùng placeholder
  return urls.map((image, i) => ({
    id: `kh-${i}`,
    alt: `Khách hàng ${i + 1} tại Laptop Chính Nguyễn`,
    image,
  }));
}

// --- Banner (lưu danh sách {image, href} trong Setting) ---
async function readBanners(key: string): Promise<BannerItem[]> {
  if (NO_DB) return [];
  const s = await prisma.setting.findUnique({ where: { key } });
  try {
    const parsed = s ? JSON.parse(s.value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is { image: string; href?: unknown } =>
          x && typeof x.image === "string" && x.image.trim() !== "",
      )
      .map((x) => ({
        image: x.image,
        href: typeof x.href === "string" && x.href ? x.href : "/san-pham",
      }));
  } catch {
    return [];
  }
}

export function getHeroBanners(): Promise<BannerItem[]> {
  return readBanners("heroBanners");
}
export function getSideBanners(): Promise<BannerItem[]> {
  return readBanners("sideBanners");
}

// --- Thống kê tổng quan (admin dashboard) ---
export interface DashboardCounts {
  orders: number;
  products: number;
  reviews: number;
  posts: number;
  users: number;
}
export interface TrafficStats {
  online: number;
  today: number;
  month: number;
  year: number;
  total: number;
}

function vnDateStr(): string {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  if (NO_DB) {
    return {
      orders: 5900,
      products: MOCK_PRODUCTS.length,
      reviews: 146,
      posts: BLOG_POSTS.length,
      users: 9145,
    };
  }
  const [orders, products, posts, users, reviewAgg] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.user.count(),
    prisma.product.aggregate({ _sum: { reviewCount: true } }),
  ]);
  return {
    orders,
    products,
    posts,
    users,
    reviews: reviewAgg._sum.reviewCount ?? 0,
  };
}

export async function getTrafficStats(): Promise<TrafficStats> {
  if (NO_DB) {
    return {
      online: 620,
      today: 8602,
      month: 241498,
      year: 3963322,
      total: 12917744,
    };
  }
  const today = vnDateStr();
  const ym = today.slice(0, 7);
  const y = today.slice(0, 4);
  const [rows, online] = await Promise.all([
    prisma.dailyView.findMany(),
    prisma.activeVisitor.count({
      where: { lastSeen: { gt: new Date(Date.now() - 5 * 60 * 1000) } },
    }),
  ]);
  let todayC = 0,
    month = 0,
    year = 0,
    total = 0;
  for (const r of rows) {
    total += r.count;
    if (r.date === today) todayC += r.count;
    if (r.date.startsWith(ym)) month += r.count;
    if (r.date.startsWith(y)) year += r.count;
  }
  return { online, today: todayC, month, year, total };
}

// Lượt xem theo TỪNG NGÀY của 1 tháng (cho biểu đồ khi lọc tháng). ym = "2026-07".
export async function getDailyViews(ym: string): Promise<number[]> {
  const [y, m] = ym.split("-").map(Number);
  const days = new Date(y, m, 0).getDate(); // số ngày trong tháng
  if (NO_DB) {
    return Array.from({ length: days }, (_, i) => {
      const base = 7000 + Math.round(2500 * Math.sin(i / 3));
      return Math.max(0, i > days - 3 ? Math.round(base * 0.4) : base);
    });
  }
  const rows = await prisma.dailyView.findMany({
    where: { date: { startsWith: ym } },
  });
  const arr = Array<number>(days).fill(0);
  for (const r of rows) {
    const d = Number(r.date.slice(8, 10));
    if (d >= 1 && d <= days) arr[d - 1] = r.count;
  }
  return arr;
}

// Tổng lượt xem theo 12 tháng của 1 năm (cho biểu đồ). year = "2026".
export async function getMonthlyViews(year: string): Promise<number[]> {
  const months = Array<number>(12).fill(0);
  if (NO_DB) {
    return [
      23800, 21200, 22100, 23600, 21400, 26200, 27100, 27400, 25100, 21900,
      9800, 0,
    ];
  }
  const rows = await prisma.dailyView.findMany({
    where: { date: { startsWith: year } },
  });
  for (const r of rows) {
    const m = Number(r.date.slice(5, 7)) - 1;
    if (m >= 0 && m < 12) months[m] += r.count;
  }
  return months;
}

// --- Cài đặt ---
export async function getSetting(key: string): Promise<string | null> {
  // Xem local: bật sẵn Flash Sale để thấy đủ khối trên trang chủ.
  if (NO_DB) return key === "flashSaleEnabled" ? "true" : null;
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? null;
}
