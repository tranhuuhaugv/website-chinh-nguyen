import { PrismaClient } from "@prisma/client";
import { PRODUCT_ARTICLES as BASE_ARTICLES } from "./product-articles";
import { PRODUCT_ARTICLES_2026_11 } from "./product-articles-2026-11";

const PRODUCT_ARTICLES = [...BASE_ARTICLES, ...PRODUCT_ARTICLES_2026_11];

// Đưa bài viết mô tả sản phẩm soạn trong code (product-articles.ts) lên DB.
// - Khớp sản phẩm theo slug.
// - CHỈ điền khi sản phẩm CHƯA có bài viết (description trống) -> bài admin đã
//   soạn/sửa hoặc đã chèn ảnh trong /admin/san-pham KHÔNG bị ghi đè, nên chạy
//   lặp lại ở mỗi lần deploy vẫn an toàn.
// - metaTitle / metaDescription cũng chỉ điền khi còn trống.
// Chạy tay: `npm run db:sync-product-articles` (deploy.yml tự chạy trước khi build).

const prisma = new PrismaClient();

/** description (cột Json) coi là trống: null, "", mảng rỗng, hoặc HTML không có chữ/ảnh. */
function isEmpty(d: unknown): boolean {
  if (d == null) return true;
  if (Array.isArray(d)) return d.length === 0;
  if (typeof d === "string") {
    if (/<img\b/i.test(d)) return false;
    return d.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
  }
  return false;
}

async function main() {
  let filled = 0;
  for (const a of PRODUCT_ARTICLES) {
    const p = await prisma.product.findUnique({
      where: { slug: a.slug },
      select: { id: true, description: true, metaTitle: true, metaDescription: true },
    });
    if (!p) {
      console.log(`Bỏ qua (không thấy sản phẩm): ${a.slug}`);
      continue;
    }
    if (!isEmpty(p.description)) {
      console.log(`Giữ nguyên (đã có bài viết): ${a.slug}`);
      continue;
    }
    await prisma.product.update({
      where: { id: p.id },
      data: {
        description: a.contentHtml,
        metaTitle: p.metaTitle?.trim() ? p.metaTitle : a.metaTitle,
        metaDescription: p.metaDescription?.trim() ? p.metaDescription : a.metaDescription,
      },
    });
    filled++;
    console.log(`Đã thêm bài viết: ${a.slug}`);
  }
  console.log(`Xong: thêm ${filled}/${PRODUCT_ARTICLES.length} bài viết sản phẩm.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
