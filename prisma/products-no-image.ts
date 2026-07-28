import { PrismaClient } from "@prisma/client";

// Rà soát sản phẩm KHÔNG có ảnh và (tuỳ chọn) xoá chúng.
//
// Chạy TRÊN VPS (nơi có DATABASE_URL trong .env):
//   npm run db:products-no-image            -> chỉ LIỆT KÊ (không xoá gì)
//   npm run db:products-no-image -- --delete -> XOÁ các sản phẩm không ảnh
//
// "Không có ảnh" = mảng images rỗng hoặc chỉ chứa chuỗi rỗng.
// Đơn hàng lưu sản phẩm dạng JSON (không khoá ngoại) nên xoá an toàn.

const prisma = new PrismaClient();

const willDelete = process.argv.includes("--delete");

function coAnh(images: string[]): boolean {
  return images.some((s) => typeof s === "string" && s.trim() !== "");
}

async function main() {
  const all = await prisma.product.findMany({
    include: { brand: true },
    orderBy: [{ createdAt: "desc" }],
  });

  const khongAnh = all.filter((p) => !coAnh(p.images));
  const coAnhList = all.filter((p) => coAnh(p.images));

  console.log(`Tổng sản phẩm: ${all.length}`);
  console.log(`  - Có ảnh:      ${coAnhList.length}`);
  console.log(`  - KHÔNG ảnh:   ${khongAnh.length}`);
  console.log("");

  if (khongAnh.length === 0) {
    console.log("✅ Không có sản phẩm nào thiếu ảnh. Không cần làm gì.");
    return;
  }

  console.log("Danh sách sản phẩm KHÔNG có ảnh:");
  console.log("────────────────────────────────────────────");
  for (const p of khongAnh) {
    console.log(`  · [${p.brand.name}] ${p.name}  (${p.slug})`);
  }
  console.log("────────────────────────────────────────────");
  console.log("");

  if (!willDelete) {
    console.log(
      `Đây mới là LIỆT KÊ — chưa xoá gì. Muốn xoá ${khongAnh.length} sản phẩm trên,\n` +
        `chạy lại với cờ --delete:\n` +
        `   npm run db:products-no-image -- --delete`,
    );
    return;
  }

  const ids = khongAnh.map((p) => p.id);
  const res = await prisma.product.deleteMany({ where: { id: { in: ids } } });
  console.log(`🗑️  Đã xoá ${res.count} sản phẩm không có ảnh.`);
  console.log(`Còn lại ${coAnhList.length} sản phẩm (đều có ảnh).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
