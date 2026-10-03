import { PrismaClient } from "@prisma/client";

// Script kiểm tra sản phẩm chưa có bài viết mô tả (description null hoặc rỗng).
// Chạy trên VPS: npx tsx prisma/check-no-description.ts
// (cần DATABASE_URL trỏ đúng PostgreSQL)

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      description: true,
      active: true,
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  const noDesc = products.filter((p) => {
    if (!p.description) return true;
    // description là JSON — nếu là mảng rỗng hoặc mảng toàn khối trống thì cũng coi là chưa có
    const d = p.description as unknown;
    if (Array.isArray(d) && d.length === 0) return true;
    if (typeof d === "string" && d.trim() === "") return true;
    return false;
  });

  const withDesc = products.length - noDesc.length;

  console.log(`\n📊 Tổng sản phẩm: ${products.length}`);
  console.log(`✅ Đã có mô tả : ${withDesc}`);
  console.log(`❌ Chưa có mô tả: ${noDesc.length}\n`);

  // Gom theo brand
  const byBrand: Record<string, typeof noDesc> = {};
  for (const p of noDesc) {
    const brand = p.brand?.name ?? "Không rõ hãng";
    if (!byBrand[brand]) byBrand[brand] = [];
    byBrand[brand].push(p);
  }

  for (const [brand, items] of Object.entries(byBrand).sort()) {
    console.log(`\n── ${brand} (${items.length} máy) ──`);
    for (const p of items) {
      const status = p.active ? "🟢" : "🔴 (ẩn)";
      console.log(
        `  ${status} ${p.name}\n      /admin/san-pham/${p.id}`
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
