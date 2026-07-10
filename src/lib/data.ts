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

// Lớp truy vấn database (Prisma) cho các trang khách hàng.
// Trả về đúng shape mà component đang dùng (không phải sửa component).

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
  const rows = await prisma.product.findMany({
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isFlashSale: true },
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isFlashSale: false },
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug }, ...withBrand });
  return row ? toProduct(row as PrismaProductWithBrand) : null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { slug: { not: product.slug } },
    ...withBrand,
    orderBy: { sort: "asc" },
  });
  const mapped = rows.map((r) => toProduct(r as PrismaProductWithBrand));
  const sameBrand = mapped.filter((p) => p.brand === product.brand);
  const others = mapped.filter((p) => p.brand !== product.brand);
  return [...sameBrand, ...others].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

// --- Danh mục ---
export async function getCategories(): Promise<Category[]> {
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
  const c = await prisma.category.findUnique({ where: { slug } });
  return c?.name ?? null;
}

export async function getBrandBySlug(slug: string): Promise<string | null> {
  const b = await prisma.brand.findUnique({ where: { slug } });
  return b?.name ?? null;
}

// --- Blog ---
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  return row ? toPost(row) : null;
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { slug: { not: post.slug } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toPost);
}

export async function getAllPostSlugs(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

// --- Cài đặt ---
export async function getSetting(key: string): Promise<string | null> {
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? null;
}
