import { PrismaClient } from "@prisma/client";
import { PRODUCT_ARTICLES as BASE_ARTICLES } from "./product-articles";
import { PRODUCT_ARTICLES_2026_11 } from "./product-articles-2026-11";
import {
  PRODUCT_ARTICLES_2026_11B,
  META_ONLY,
  META_FIXES,
} from "./product-articles-2026-11b";

const PRODUCT_ARTICLES = [
  ...BASE_ARTICLES,
  ...PRODUCT_ARTICLES_2026_11,
  ...PRODUCT_ARTICLES_2026_11B,
];

// Đưa bài viết mô tả sản phẩm soạn trong code (product-articles.ts) lên DB.
// - Khớp sản phẩm theo slug.
// - CHỈ điền khi sản phẩm CHƯA có bài viết (description trống) -> bài admin đã
//   soạn/sửa hoặc đã chèn ảnh trong /admin/san-pham KHÔNG bị ghi đè, nên chạy
//   lặp lại ở mỗi lần deploy vẫn an toàn.
// - metaTitle / metaDescription chỉ điền khi còn trống (kể cả khi bài đã có sẵn).
// - META_FIXES: sửa meta ghi sai cấu hình, chỉ khi DB còn đúng y bản sai.
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

/** Trả về phần meta cần điền (chỉ các trường đang trống), hoặc null nếu không cần. */
function metaPatch(
  p: { metaTitle: string | null; metaDescription: string | null },
  title: string,
  description: string,
): { metaTitle?: string; metaDescription?: string } | null {
  const data: { metaTitle?: string; metaDescription?: string } = {};
  if (!p.metaTitle?.trim()) data.metaTitle = title;
  if (!p.metaDescription?.trim()) data.metaDescription = description;
  return Object.keys(data).length ? data : null;
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
      // Bài đã có: giữ nguyên bài, chỉ điền meta nếu còn trống.
      const meta = metaPatch(p, a.metaTitle, a.metaDescription);
      if (meta) {
        await prisma.product.update({ where: { id: p.id }, data: meta });
        console.log(`Đã điền meta (giữ bài cũ): ${a.slug}`);
      } else {
        console.log(`Giữ nguyên (đã có bài viết): ${a.slug}`);
      }
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

  // Sản phẩm đã có bài nhưng meta trống -> điền meta.
  for (const m of META_ONLY) {
    const p = await prisma.product.findUnique({
      where: { slug: m.slug },
      select: { id: true, metaTitle: true, metaDescription: true },
    });
    if (!p) continue;
    const meta = metaPatch(p, m.metaTitle, m.metaDescription);
    if (meta) {
      await prisma.product.update({ where: { id: p.id }, data: meta });
      console.log(`Đã điền meta: ${m.slug}`);
    }
  }

  // Meta ghi sai cấu hình -> chỉ thay khi DB còn đúng y bản sai (admin đã sửa thì thôi).
  for (const f of META_FIXES) {
    const p = await prisma.product.findUnique({
      where: { slug: f.slug },
      select: { id: true, metaTitle: true, metaDescription: true },
    });
    if (!p) continue;
    const data: { metaTitle?: string; metaDescription?: string } = {};
    if (f.metaTitle && p.metaTitle?.trim() === f.fromTitle) data.metaTitle = f.metaTitle;
    if (f.metaDescription && p.metaDescription?.trim() === f.fromDescription)
      data.metaDescription = f.metaDescription;
    if (Object.keys(data).length) {
      await prisma.product.update({ where: { id: p.id }, data });
      console.log(`Đã sửa meta sai: ${f.slug}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
