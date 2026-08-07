import { prisma } from "./prisma";
import type {
  BannerItem,
  BlogAccent,
  BlogPost,
  Brand,
  Category,
  CategoryIconName,
  CustomerPhoto,
  Product,
  ProductAccent,
  ProductCondition,
  Store,
} from "./types";
import { SITE } from "./site";
import { sanitizeRichText, toRichHtml } from "./rich-text";
import { NEED_OPTIONS, matchesKeyword } from "./product-query";
import { VOUCHERS, type Voucher } from "./vouchers";
import type { Policy, Section } from "./policies";
import { EDITABLE_PAGES } from "./policies";
import type { PcPart } from "./pc-parts";
import { PC_PART_TYPE_KEYS } from "./pc-parts";
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

/** Chuẩn hoá cột Json "options" -> [{label, price}] (bỏ dòng thiếu/không hợp lệ). */
function parseOptions(raw: unknown): { label: string; price: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (x): x is { label: unknown; price: unknown } =>
        !!x && typeof x === "object",
    )
    .map((x) => ({
      label: String((x as { label?: unknown }).label ?? "").trim(),
      price: Math.max(0, Math.round(Number((x as { price?: unknown }).price)) || 0),
    }))
    .filter((o) => o.label && o.price > 0);
}

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
    capacity: p.capacity ?? undefined,
    color: p.color ?? undefined,
    gpu: p.gpu ?? undefined,
    mux: p.mux ?? undefined,
    webcam: p.webcam ?? undefined,
    screen: p.screen ?? undefined,
    resolution: p.resolution ?? undefined,
    refresh: p.refresh ?? undefined,
    os: p.os ?? undefined,
    battery: p.battery ?? undefined,
    weight: p.weight ?? undefined,
    ports: p.ports ?? undefined,
    warranty: p.warranty ?? undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    installmentPerMonth: p.installmentPerMonth ?? undefined,
    gift: p.gift ?? undefined,
    badge: p.badge ?? undefined,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    accent: p.accent as ProductAccent,
    images: p.images ?? [],
    variantSlugs: p.variantSlugs ?? [],
    // Mô tả admin tự soạn (HTML từ CKEditor). toRichHtml lọc XSS + tự đổi dữ
    // liệu CŨ (mảng khối) sang HTML -> mô tả soạn trước đây vẫn hiện.
    // "h3": trang SP đã có h1 (tên máy) + h2 ("Mô tả sản phẩm") ở trên.
    description: toRichHtml(p.description, "h3"),
    condition: (p.condition as ProductCondition) ?? "used",
    stockStatus: p.stockStatus ?? "con_hang",
    options: parseOptions(p.options),
    needs: p.needs ?? [],
    series: p.series ?? undefined,
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
  image?: string | null;
}): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    tag: b.tag,
    excerpt: b.excerpt,
    image: b.image ?? undefined,
    content: toRichHtml(b.content),
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

/** Số máy tối đa cho khối Flash Sale trang chủ (khối là 1 lưới, không phân trang). */
const FLASH_SALE_LIMIT = 8;

export async function getFlashSaleProducts(): Promise<Product[]> {
  if (NO_DB) return FLASH_SALE_PRODUCTS;
  const rows = await prisma.product.findMany({
    where: { isFlashSale: true },
    ...withBrand,
    orderBy: { sort: "asc" },
    take: FLASH_SALE_LIMIT,
  });
  return rows.map((r) => toProduct(r as PrismaProductWithBrand));
}

/** Số máy tối đa cho khối "Sản phẩm nổi bật" (khối này có tab hãng + xem thêm). */
const FEATURED_LIMIT = 24;

/**
 * Khối "Sản phẩm nổi bật" trang chủ: máy admin TÍCH nổi bật.
 * Máy có thể VỪA nổi bật VỪA flash sale (hiện ở cả hai khối) -> KHÔNG loại
 * flash sale ở đây. Giới hạn FEATURED_LIMIT để không đổ hết máy xuống trình
 * duyệt (quy tắc "không query lấy tất cả" trong CLAUDE.md).
 *
 * CHƯA tích máy nào -> lấy máy mới nhất cho khối khỏi trống.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  if (NO_DB) return FEATURED_PRODUCTS;
  const rows = await prisma.product.findMany({
    where: { isFeatured: true },
    ...withBrand,
    orderBy: { sort: "asc" },
    take: FEATURED_LIMIT,
  });
  if (rows.length) {
    return rows.map((r) => toProduct(r as PrismaProductWithBrand));
  }

  const duPhong = await prisma.product.findMany({
    ...withBrand,
    orderBy: { createdAt: "desc" },
    take: FEATURED_LIMIT,
  });
  return duPhong.map((r) => toProduct(r as PrismaProductWithBrand));
}

/**
 * "Sản phẩm mới về" (tab trong ô Flash Sale): ưu tiên máy tích "Mới", nếu chưa
 * tích máy nào thì lấy máy mới thêm gần đây nhất.
 */
const NEW_LIMIT = 12;

export async function getNewProducts(): Promise<Product[]> {
  if (NO_DB) return FEATURED_PRODUCTS;
  const rows = await prisma.product.findMany({
    where: { isNew: true },
    ...withBrand,
    orderBy: { createdAt: "desc" },
    take: NEW_LIMIT,
  });
  if (rows.length) {
    return rows.map((r) => toProduct(r as PrismaProductWithBrand));
  }
  const recent = await prisma.product.findMany({
    ...withBrand,
    orderBy: { createdAt: "desc" },
    take: NEW_LIMIT,
  });
  return recent.map((r) => toProduct(r as PrismaProductWithBrand));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (NO_DB) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const row = await prisma.product.findUnique({ where: { slug }, ...withBrand });
  return row ? toProduct(row as PrismaProductWithBrand) : null;
}

/** 1 lựa chọn cấu hình ở trang chi tiết (nút "8GB - 256GB"). */
export interface VariantOption {
  slug: string;
  ram: string;
  storage: string;
  price: number;
  capacity?: string | null;
}

/** "512GB" -> 512, "1TB" -> 1024. Không đọc được -> 0 (xếp lên đầu). */
function dungLuongGB(s: string): number {
  const m = /([\d.]+)\s*(TB|GB)/i.exec(s ?? "");
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return 0;
  return m[2].toUpperCase() === "TB" ? n * 1024 : n;
}

/** Xếp nút theo DUNG LƯỢNG tăng dần (RAM rồi ổ cứng), không theo giá: giá
 *  không phải lúc nào cũng tăng theo dung lượng -> nút sẽ nhảy lộn xộn. */
function xepTheoDungLuong(a: VariantOption, b: VariantOption): number {
  return (
    dungLuongGB(a.ram) - dungLuongGB(b.ram) ||
    dungLuongGB(a.storage) - dungLuongGB(b.storage) ||
    a.price - b.price
  );
}

/** Máy ĐANG XEM đứng đầu, các máy nối thêm xếp sau theo dung lượng tăng dần. */
function xepNut(list: VariantOption[], slugDangXem: string): VariantOption[] {
  const dangXem = list.filter((o) => o.slug === slugDangXem);
  const conLai = list
    .filter((o) => o.slug !== slugDangXem)
    .sort(xepTheoDungLuong);
  return [...dangXem, ...conLai];
}

const chonCot = {
  slug: true,
  ram: true,
  storage: true,
  price: true,
  capacity: true,
} as const;

/**
 * Nút chọn "Dung lượng" ở trang chi tiết.
 *
 * LUÔN có nút của chính máy đang xem (dù chưa gán link nào). Gán thêm link thì
 * có thêm nút của máy đó.
 *
 * CHỈ lấy link admin gán ở CHÍNH máy này (1 chiều). KHÔNG tra ngược "ai đang
 * trỏ về đây": gán link ở máy nào thì chỉ máy đó hiện thêm nút, máy kia muốn có
 * thì admin tự gán — mỗi trang admin toàn quyền quyết định.
 */
export async function getProductVariants(
  product: Product,
): Promise<VariantOption[]> {
  const banThan = {
    slug: product.slug,
    ram: product.ram,
    storage: product.storage,
    price: product.price,
    capacity: product.capacity ?? null,
  };
  const links = (product.variantSlugs ?? []).filter((s) => s !== product.slug);
  if (!links.length) return [banThan];

  if (NO_DB) {
    const list = MOCK_PRODUCTS.filter((p) => links.includes(p.slug));
    return xepNut(
      [
        ...list.map((p) => ({
          slug: p.slug,
          ram: p.ram,
          storage: p.storage,
          price: p.price,
          capacity: p.capacity ?? null,
        })),
        banThan,
      ],
      product.slug,
    );
  }

  // Link trỏ tới máy đã xoá -> không tìm thấy -> chỉ còn nút của máy này.
  const rows = await prisma.product.findMany({
    where: { slug: { in: links } },
    select: chonCot,
  });

  // Kèm chính máy đang xem để nó là nút đang chọn (và đứng đầu).
  return xepNut([...rows, banThan], product.slug);
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
  // Khớp "gần đúng" (bỏ dấu, đủ mọi từ khoá trong tên + hãng + cấu hình) —
  // dùng chung logic với trang /tim-kiem. Kho ~vài trăm máy nên lọc trong JS
  // trên toàn bộ sản phẩm là đủ nhanh và cho kết quả nhất quán.
  const all = await getAllProducts();
  return all.filter((p) => matchesKeyword(p, term)).slice(0, limit);
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
    group: c.group ?? undefined,
  }));
}

export async function getCategoryName(slug: string): Promise<string | null> {
  if (NO_DB) return CATEGORIES.find((c) => c.slug === slug)?.name ?? null;
  const c = await prisma.category.findUnique({ where: { slug } });
  return c?.name ?? null;
}

/**
 * Số sản phẩm mỗi danh mục (cho cây danh mục admin). Đếm ĐÚNG như trang danh
 * mục ngoài web lọc: dòng máy theo cột `series`; hãng theo `brand`; loại máy
 * theo `condition`; nhu cầu theo `needs`.
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const [cats, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);
  const brandSlug = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const NEED_BY_SLUG: Record<string, string> = {
    "laptop-gaming": "gaming",
    "laptop-do-hoa": "do-hoa",
    "laptop-van-phong": "van-phong",
  };
  const counts: Record<string, number> = {};
  for (const c of cats) {
    let n = 0;
    if (c.group === "dong-may") {
      n = products.filter((p) => p.series === c.slug).length;
    } else if (products.some((p) => brandSlug(p.brand) === c.slug)) {
      n = products.filter((p) => brandSlug(p.brand) === c.slug).length;
    } else if (c.slug === "laptop-moi") {
      n = products.filter((p) => p.condition === "new").length;
    } else if (c.slug === "laptop-cu") {
      n = products.filter((p) => (p.condition ?? "used") === "used").length;
    } else if (NEED_BY_SLUG[c.slug]) {
      n = products.filter((p) =>
        (p.needs ?? []).includes(NEED_BY_SLUG[c.slug]),
      ).length;
    }
    counts[c.slug] = n;
  }
  return counts;
}

/** Thông tin SEO của 1 danh mục cho trang khách. `seoContent` đã lọc XSS sẵn. */
export interface CategorySeo {
  name: string;
  metaDescription: string | null;
  seoContent: string; // HTML đã sanitize; "" nếu chưa soạn
  group: string | null; // "dong-may" -> trang lọc SP theo series
  cover: string | null; // ảnh bìa NGANG riêng (admin tải lên) -> hero trang danh mục
}

export async function getCategorySeo(slug: string): Promise<CategorySeo | null> {
  if (NO_DB) {
    const c = CATEGORIES.find((x) => x.slug === slug);
    return c
      ? {
          name: c.name,
          metaDescription: null,
          seoContent: "",
          group: null,
          cover: null,
        }
      : null;
  }
  const c = await prisma.category.findUnique({ where: { slug } });
  if (!c) return null;
  return {
    name: c.name,
    metaDescription: c.metaDescription ?? null,
    seoContent: c.seoContent ? sanitizeRichText(c.seoContent) : "",
    group: c.group ?? null,
    cover: c.coverImage ?? null,
  };
}

// Dòng máy mẫu cho chế độ NO_DB (xem giao diện local khi chưa có DB thật).
const MOCK_SERIES: { slug: string; name: string }[] = [
  { slug: "lenovo-legion", name: "Lenovo Legion" },
  { slug: "lenovo-thinkpad", name: "Lenovo ThinkPad" },
  { slug: "lenovo-ideapad", name: "Lenovo IdeaPad" },
  { slug: "dell-xps", name: "Dell XPS" },
  { slug: "dell-latitude", name: "Dell Latitude" },
  { slug: "dell-inspiron", name: "Dell Inspiron" },
  { slug: "asus-rog", name: "Asus ROG" },
  { slug: "asus-tuf", name: "Asus TUF Gaming" },
  { slug: "asus-zenbook", name: "Asus Zenbook" },
  { slug: "hp-pavilion", name: "HP Pavilion" },
  { slug: "hp-victus", name: "HP Victus" },
  { slug: "acer-nitro", name: "Acer Nitro" },
  { slug: "acer-aspire", name: "Acer Aspire" },
];

/** Danh sách dòng máy (Category group="dong-may") cho dropdown form SP + điều hướng. */
export async function getSeriesCategories(): Promise<
  { slug: string; name: string }[]
> {
  if (NO_DB) return MOCK_SERIES;
  const rows = await prisma.category.findMany({
    where: { group: "dong-may" },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });
  return rows.map((r) => ({ slug: r.slug, name: r.name }));
}

/**
 * Dropdown GỘP "Hãng / Dòng máy" cho form sản phẩm (1 ô thay vì 2). Mỗi option
 * lưu cả hãng lẫn dòng máy dưới dạng "TênHãng||slug-dòng" (slug rỗng = cả hãng).
 * Dòng máy được gom dưới hãng của nó (slug dòng bắt đầu bằng slug hãng).
 */
export async function getBrandSeriesOptions(): Promise<
  { value: string; label: string }[]
> {
  if (NO_DB) return [];
  const [brands, series] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.category.findMany({
      where: { group: "dong-may" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);
  // Hãng = "- Dell" (chọn được = cả hãng); dòng máy thụt vào = "-- Dell XPS".
  const opts: { value: string; label: string }[] = [];
  for (const b of brands) {
    opts.push({ value: `${b.name}||`, label: `- ${b.name}` });
    for (const s of series.filter((x) => x.slug.startsWith(`${b.slug}-`))) {
      opts.push({ value: `${b.name}||${s.slug}`, label: `-- ${s.name}` });
    }
  }
  return opts;
}

/** Lấy nguyên bản 1 danh mục cho form sửa admin (gồm cả trường SEO). */
export async function getCategoryEdit(slug: string) {
  if (NO_DB) return null;
  return prisma.category.findUnique({ where: { slug } });
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

// --- Sản phẩm & thương hiệu (admin) ---
/** Danh sách sản phẩm cho trang quản trị (đọc DB thật). */
export async function getAdminProducts() {
  if (NO_DB) return [];
  const rows = await prisma.product.findMany({
    ...withBrand,
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand.name,
    price: p.price,
    condition: p.condition,
    cpu: p.cpu,
    ram: p.ram,
    storage: p.storage,
    series: p.series ?? "", // slug dòng máy để lọc trong admin
    updatedBy: p.updatedBy ?? "", // email admin thêm/sửa gần nhất
  }));
}

/** 1 sản phẩm (đủ trường) để đổ vào form sửa. */
export async function getAdminProductById(id: string) {
  if (NO_DB) return null;
  const p = await prisma.product.findUnique({ where: { id }, ...withBrand });
  if (!p) return null;
  return { ...p, brandName: p.brand.name };
}


/** Thương hiệu + số sản phẩm mỗi hãng. */
export async function getAdminBrands() {
  if (NO_DB) return [];
  const rows = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    count: b._count.products,
  }));
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
  // Xem local: bật sẵn Flash Sale + voucher để thấy đủ khối trên trang chủ.
  if (NO_DB)
    return ["flashSaleEnabled", "vouchersEnabled"].includes(key) ? "true" : null;
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? null;
}

/** Danh sách trang tuỳ chỉnh admin tự tạo (không phải trang cố định trong code). */
export async function getCustomPages(): Promise<
  { slug: string; title: string }[]
> {
  if (NO_DB) return [];
  const rows = await prisma.page.findMany({ select: { id: true, title: true } });
  return rows
    .filter((r) => !EDITABLE_PAGES[r.id]) // bỏ các bản override của trang cố định
    .map((r) => ({ slug: r.id, title: r.title }));
}

/** Ảnh không gian cửa hàng (admin upload, Setting "aboutPhotos") -> mảng URL. */
export async function getAboutPhotos(): Promise<string[]> {
  const raw = await getSetting("aboutPhotos");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string" && x.trim() !== "")
      : [];
  } catch {
    return [];
  }
}

/**
 * Danh sách cửa hàng — admin tự thêm/sửa (lưu Setting "stores" dạng JSON
 * [{name,address,city}]). CHƯA từng cấu hình -> mặc định SITE.stores; đã lưu
 * (kể cả mảng rỗng khi admin xoá hết) -> theo đúng admin.
 * Dùng cho: Footer, trang Hệ thống cửa hàng, Liên hệ, schema trang chủ, chi tiết SP.
 */
export async function getStores(): Promise<Store[]> {
  const raw = await getSetting("stores");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const clean = parsed
          .filter(
            (x): x is { name: string; address: string; city?: unknown } =>
              x &&
              typeof x.name === "string" &&
              typeof x.address === "string" &&
              x.name.trim() !== "" &&
              x.address.trim() !== "",
          )
          .map((x) => ({
            name: x.name.trim(),
            address: x.address.trim(),
            city:
              typeof x.city === "string" && x.city.trim()
                ? x.city.trim()
                : "Đà Nẵng",
          }));
        // Đã lưu 1 mảng hợp lệ -> theo đúng admin, KỂ CẢ rỗng (admin xoá hết
        // thì hiện rỗng, không tự đổ lại 4 địa chỉ mặc định như trước).
        return clean;
      }
    } catch {
      // JSON hỏng -> rơi xuống mặc định
    }
  }
  return SITE.stores.map((s) => ({ ...s }));
}

/**
 * Danh sách "nhu cầu sử dụng" — admin tự sửa (lưu Setting "needs" dạng JSON
 * [{value,label}]). Chưa cấu hình -> dùng danh sách mặc định NEED_OPTIONS.
 * Dùng cho: ô tick nhu cầu ở form sản phẩm + bộ lọc nhu cầu ngoài web.
 */
export async function getNeeds(): Promise<{ value: string; label: string }[]> {
  const raw = await getSetting("needs");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const clean = parsed
          .filter(
            (x): x is { value: string; label: string } =>
              x &&
              typeof x.value === "string" &&
              typeof x.label === "string" &&
              x.value.trim() !== "" &&
              x.label.trim() !== "",
          )
          .map((x) => ({ value: x.value.trim(), label: x.label.trim() }));
        if (clean.length) return clean;
      }
    } catch {
      /* JSON hỏng -> dùng mặc định */
    }
  }
  return [...NEED_OPTIONS];
}

/**
 * Danh sách MÃ GIẢM GIÁ — admin tự sửa (lưu Setting "vouchers" dạng JSON
 * [{code,amount,minSubtotal,quantity}]). Chưa cấu hình -> dùng mặc định VOUCHERS.
 * Dùng cho: khối voucher trang chủ + ô nhập mã ở giỏ + kiểm tra khi đặt hàng.
 */
export async function getVouchers(): Promise<Voucher[]> {
  const raw = await getSetting("vouchers");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const clean = parsed
          .map((x) => ({
            code: String(x?.code ?? "").trim().toUpperCase(),
            amount: Math.max(0, Math.round(Number(x?.amount) || 0)),
            minSubtotal: Math.max(0, Math.round(Number(x?.minSubtotal) || 0)),
            quantity: Math.max(0, Math.round(Number(x?.quantity) || 0)),
          }))
          .filter((v) => v.code && v.amount > 0);
        if (clean.length) return clean;
      }
    } catch {
      /* JSON hỏng -> dùng mặc định */
    }
  }
  return VOUCHERS.map((v) => ({ ...v }));
}

// --- Mã giảm giá: đếm số lượt đã dùng (theo đơn hàng đã lưu) ---
// Trả về map code -> số đơn đã dùng mã đó. Dùng để tính số lượt còn lại.
export async function getVoucherUsage(): Promise<Record<string, number>> {
  if (NO_DB) return {};
  const rows = await prisma.order.groupBy({
    by: ["voucher"],
    where: { voucher: { not: null } },
    _count: { voucher: true },
  });
  const usage: Record<string, number> = {};
  for (const r of rows) {
    if (r.voucher) usage[r.voucher] = r._count.voucher;
  }
  return usage;
}

/** Số lượt còn lại của 1 mã (đã trừ số đơn đã dùng), không âm. */
export async function getVoucherRemaining(
  code: string,
  quantity: number,
): Promise<number> {
  if (NO_DB) return quantity;
  const used = await prisma.order.count({ where: { voucher: code } });
  return Math.max(0, quantity - used);
}

// ——— Build PC: linh kiện ———

// Mock linh kiện cho chế độ NO_DB (xem/giao diện local khi chưa có DB).
const MOCK_PC_PARTS: PcPart[] = [
  { id: "cpu-1", type: "cpu", name: "Intel Core i5-12400F", price: 2990000, brand: "Intel", note: "6 nhân 12 luồng, 4.4GHz" },
  { id: "cpu-2", type: "cpu", name: "Intel Core i5-13400F", price: 4290000, brand: "Intel", note: "10 nhân, 4.6GHz" },
  { id: "cpu-3", type: "cpu", name: "AMD Ryzen 5 5600", price: 2790000, brand: "AMD", note: "6 nhân 12 luồng" },
  { id: "main-1", type: "mainboard", name: "ASUS PRIME H610M-K", price: 1990000, brand: "ASUS", note: "LGA1700, DDR4" },
  { id: "main-2", type: "mainboard", name: "MSI B760M-A WIFI", price: 3490000, brand: "MSI", note: "LGA1700, DDR4, WiFi" },
  { id: "ram-1", type: "ram", name: "Corsair Vengeance 16GB (2x8) DDR4 3200", price: 990000, brand: "Corsair", note: "16GB DDR4" },
  { id: "ram-2", type: "ram", name: "Kingston Fury 32GB (2x16) DDR4 3600", price: 1890000, brand: "Kingston", note: "32GB DDR4" },
  { id: "vga-1", type: "vga", name: "NVIDIA RTX 4060 8GB", price: 8490000, brand: "NVIDIA", note: "8GB GDDR6" },
  { id: "vga-2", type: "vga", name: "NVIDIA RTX 4070 12GB", price: 15990000, brand: "NVIDIA", note: "12GB GDDR6X" },
  { id: "ssd-1", type: "storage", name: "Samsung 980 500GB NVMe", price: 890000, brand: "Samsung", note: "SSD NVMe Gen3" },
  { id: "ssd-2", type: "storage", name: "WD Black SN770 1TB NVMe", price: 1790000, brand: "WD", note: "SSD NVMe Gen4" },
  { id: "psu-1", type: "psu", name: "Corsair CV550 550W", price: 990000, brand: "Corsair", note: "550W 80+ Bronze" },
  { id: "psu-2", type: "psu", name: "Cooler Master MWE 650W", price: 1490000, brand: "Cooler Master", note: "650W 80+ Bronze" },
  { id: "case-1", type: "case", name: "Xigmatek Gaming X", price: 690000, brand: "Xigmatek", note: "ATX, kính cường lực" },
  { id: "cool-1", type: "cooling", name: "Deepcool AK400", price: 690000, brand: "Deepcool", note: "Tản khí, 4 ống đồng" },
];

/** Linh kiện đang bật (cho trang Build PC), sắp theo type + sort + giá. */
export async function getPcParts(): Promise<PcPart[]> {
  if (NO_DB) return MOCK_PC_PARTS;
  const rows = await prisma.pcPart.findMany({
    where: { active: true },
    orderBy: [{ type: "asc" }, { sort: "asc" }, { price: "asc" }],
    select: {
      id: true,
      type: true,
      name: true,
      price: true,
      brand: true,
      image: true,
      note: true,
    },
  });
  return rows;
}

/** Toàn bộ linh kiện (kể cả tắt) cho trang admin. */
export async function getPcPartsAdmin(): Promise<
  (PcPart & { active: boolean; sort: number })[]
> {
  if (NO_DB) return MOCK_PC_PARTS.map((p) => ({ ...p, active: true, sort: 0 }));
  return prisma.pcPart.findMany({
    orderBy: [{ type: "asc" }, { sort: "asc" }, { price: "asc" }],
  });
}

/** 1 linh kiện theo id (cho trang sửa trong admin). */
export async function getPcPartById(
  id: string,
): Promise<(PcPart & { active: boolean; sort: number }) | null> {
  if (NO_DB) {
    const p = MOCK_PC_PARTS.find((x) => x.id === id);
    return p ? { ...p, active: true, sort: 0 } : null;
  }
  return prisma.pcPart.findUnique({ where: { id } });
}

/** Đảm bảo type hợp lệ (dùng ở API). */
export function validPcPartType(type: string): boolean {
  return PC_PART_TYPE_KEYS.includes(type);
}
