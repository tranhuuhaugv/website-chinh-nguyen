import { PrismaClient } from "@prisma/client";

// Điền GIÁ GỐC (oldPrice) cho sản phẩm còn thiếu để mọi máy đều hiện giảm giá.
// - Chỉ đụng sản phẩm oldPrice trống hoặc <= giá bán (dữ liệu sai) — giá admin
//   tự đặt được GIỮ NGUYÊN, nên chạy lặp lại ở mỗi lần deploy vẫn an toàn.
// - Mức giảm 8–15%% chọn ổn định theo slug (cùng máy luôn ra cùng %) cho tự nhiên.
// Chạy tay: `npm run db:fill-discounts` (deploy.yml tự chạy trước khi build).

const prisma = new PrismaClient();

/** Băm chuỗi -> số ổn định (để % giảm không đổi giữa các lần chạy). */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Làm tròn giá lên số đẹp: <5tr theo 50K, còn lại theo 100K. */
function roundNice(v: number): number {
  const step = v < 5_000_000 ? 50_000 : 100_000;
  return Math.ceil(v / step) * step;
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, price: true, oldPrice: true },
  });

  let updated = 0;
  for (const p of products) {
    if (p.oldPrice && p.oldPrice > p.price) continue; // đã có giảm giá hợp lệ

    const percent = 8 + (hash(p.slug) % 8); // 8..15%
    const oldPrice = roundNice(p.price * (1 + percent / 100));
    await prisma.product.update({
      where: { id: p.id },
      data: { oldPrice },
    });
    updated++;
  }
  console.log(`Đã điền giá gốc cho ${updated}/${products.length} sản phẩm.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
