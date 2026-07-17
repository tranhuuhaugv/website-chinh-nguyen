// Nạp bài viết SEO/GEO + meta description cho các danh mục / nhu cầu.
// Nội dung nằm ở prisma/category-seo.json (15 bài dài, chuẩn SEO + GEO).
//
// Chạy 1 lần trên VPS SAU khi deploy (đã có cột seoContent):
//   cd /var/www/website-chinh-nguyen && npx tsx prisma/category-seo.ts
//
// GHI ĐÈ: lệnh này đặt lại seoContent + metaDescription cho các danh mục có
// trong file JSON. Sau khi đã chỉnh bài trong admin thì ĐỪNG chạy lại (sẽ ghi
// đè bản chỉnh). Muốn sửa nội dung: sửa trong Admin → Danh mục (CKEditor).

import { readFileSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Seo {
  slug: string;
  metaDescription: string;
  html: string;
}

const FILE = path.join(process.cwd(), "prisma", "category-seo.json");
const ARTICLES: Seo[] = JSON.parse(readFileSync(FILE, "utf8"));

async function main() {
  let done = 0;
  let missing = 0;
  for (const a of ARTICLES) {
    const cat = await prisma.category.findUnique({ where: { slug: a.slug } });
    if (!cat) {
      missing++;
      console.log(`- BỎ QUA (không có danh mục): ${a.slug}`);
      continue;
    }
    await prisma.category.update({
      where: { slug: a.slug },
      data: {
        seoContent: a.html.trim(),
        metaDescription: a.metaDescription,
      },
    });
    done++;
    console.log(`- Đã nạp bài SEO: ${a.slug}`);
  }
  console.log(`\nXong. Nạp: ${done} | Không có danh mục: ${missing}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
