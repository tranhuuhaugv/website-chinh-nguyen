import { PrismaClient } from "@prisma/client";
import { CATEGORIES, CATEGORY_GROUPS } from "../src/lib/mock-data";

// Đồng bộ lại DANH MỤC theo danh sách trong code — KHÔNG đụng sản phẩm/đơn/hãng.
// Category không có khoá ngoại nên xoá & tạo lại an toàn.
// Chạy trên VPS khi cần cập nhật danh mục: `npm run db:categories`

const prisma = new PrismaClient();

function categoryGroup(slug: string): string | null {
  const g = CATEGORY_GROUPS.find((grp) => grp.slugs.includes(slug));
  return g ? g.title : null;
}

async function main() {
  console.log("Đồng bộ danh mục (không ảnh hưởng sản phẩm/đơn hàng)...");
  await prisma.category.deleteMany();
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
  console.log(`Xong: ${CATEGORIES.length} danh mục.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
