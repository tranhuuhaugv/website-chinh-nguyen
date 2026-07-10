import { prisma } from "./prisma";
import type {
  BlogAccent,
  BlogPost,
  Brand,
  Category,
  CategoryIconName,
  Product,
  ProductAccent,
} from "./types";
import {
  ALL_PRODUCTS,
  BLOG_POSTS,
  CATEGORIES,
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

function toPost(b: {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  content: unknown;
  readMinutes: number;
  accent: string;
  date: string;
}): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    tag: b.tag,
    excerpt: b.excerpt,
    content: Array.isArray(b.content) ? (b.content as string[]) : [],
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

// --- Đơn hàng (admin) ---
export async function getOrders() {
  if (NO_DB) return [];
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
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

// --- Cài đặt ---
export async function getSetting(key: string): Promise<string | null> {
  // Xem local: bật sẵn Flash Sale để thấy đủ khối trên trang chủ.
  if (NO_DB) return key === "flashSaleEnabled" ? "true" : null;
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? null;
}
