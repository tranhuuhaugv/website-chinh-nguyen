import { PrismaClient } from "@prisma/client";
import {
  ALL_PRODUCTS,
  BLOG_POSTS,
  CATEGORIES,
  CATEGORY_GROUPS,
  FLASH_SALE_PRODUCTS,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

const FLASH_SOLD = [38, 25, 42, 15];
const flashSlugs = new Set(FLASH_SALE_PRODUCTS.map((p) => p.slug));

function brandSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function categoryGroup(slug: string): string | null {
  const g = CATEGORY_GROUPS.find((grp) => grp.slugs.includes(slug));
  return g ? g.title : null;
}

async function main() {
  console.log("Xoá dữ liệu cũ...");
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.setting.deleteMany();

  // Thương hiệu
  const brandNames = Array.from(new Set(ALL_PRODUCTS.map((p) => p.brand)));
  console.log(`Tạo ${brandNames.length} thương hiệu...`);
  for (const name of brandNames) {
    await prisma.brand.create({
      data: { name, slug: brandSlug(name) },
    });
  }
  const brands = await prisma.brand.findMany();
  const brandIdByName = new Map(brands.map((b) => [b.name, b.id]));

  // Danh mục
  console.log(`Tạo ${CATEGORIES.length} danh mục...`);
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        tag: c.tag ?? null,
        group: categoryGroup(c.slug),
        sort: i,
      },
    });
  }

  // Sản phẩm
  console.log(`Tạo ${ALL_PRODUCTS.length} sản phẩm...`);
  let flashIndex = 0;
  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const p = ALL_PRODUCTS[i];
    const isFlash = flashSlugs.has(p.slug);
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        sort: i,
        brandId: brandIdByName.get(p.brand)!,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        cpu: p.cpu,
        ram: p.ram,
        storage: p.storage,
        rating: p.rating,
        reviewCount: p.reviewCount,
        installmentPerMonth: p.installmentPerMonth ?? null,
        gift: p.gift ?? null,
        badge: p.badge ?? null,
        isNew: p.isNew ?? false,
        isFlashSale: isFlash,
        flashSold: isFlash ? FLASH_SOLD[flashIndex++ % FLASH_SOLD.length] : null,
        accent: p.accent,
        images: [],
        needs: [],
        commitments: [],
      },
    });
  }

  // Blog
  console.log(`Tạo ${BLOG_POSTS.length} bài viết...`);
  for (const b of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        slug: b.slug,
        title: b.title,
        tag: b.tag,
        excerpt: b.excerpt,
        image: b.image ?? null,
        content: JSON.parse(JSON.stringify(b.content)),
        readMinutes: b.readMinutes,
        accent: b.accent,
        date: b.date,
      },
    });
  }

  // Cài đặt
  console.log("Tạo cài đặt mặc định...");
  await prisma.setting.create({
    data: { key: "flashSaleEnabled", value: "false" },
  });

  console.log("✅ Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
