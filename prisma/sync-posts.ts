import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../src/lib/mock-data";

// Đưa các bài blog soạn trong code (mock-data) lên DB production.
// CHỈ TẠO bài còn thiếu (theo slug) — không ghi đè, không xoá, nên bài admin
// tự thêm/sửa qua /admin/blog không bị ảnh hưởng. Chạy: `npm run db:sync-posts`
// (deploy.yml tự chạy trước khi build để trang blog render tĩnh có bài mới).

// Chỉ sync các slug liệt kê ở đây (tránh tự ý thêm lại bài admin đã xoá).
const SYNC_SLUGS = [
  "laptop-van-phong-2026-nen-chon-core-i5-hay-core-i7",
  "nen-mua-laptop-moi-hay-laptop-cu-nam-2026",
  "macbook-cu-2026-nen-mua-m1-m2-hay-m3",
  "back-to-school-2026-giam-gia-theo-diem-thi",
  "mua-laptop-cu-o-dau-uy-tin-tai-da-nang",
  "top-5-laptop-gaming-cu-gia-re-da-nang-2026",
  "kinh-nghiem-chon-laptop-may-tram-do-hoa-render",
  "dell-xps-13-vs-xps-15-nen-mua-ban-nao",
  "cach-kiem-tra-laptop-cu-truoc-khi-mua-checklist",
  "laptop-gaming-rtx-4060-tam-gia-nao-2026",
  "co-nen-mua-laptop-tra-gop-0-tai-da-nang",
  "laptop-render-3d-chon-may-tram-hay-gaming",
];

const prisma = new PrismaClient();

async function main() {
  for (const slug of SYNC_SLUGS) {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) {
      console.warn(`Bỏ qua "${slug}": không có trong BLOG_POSTS.`);
      continue;
    }
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Đã có "${slug}" — giữ nguyên.`);
      continue;
    }
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        readMinutes: post.readMinutes,
        accent: post.accent,
        image: post.image ?? null,
        date: post.date,
      },
    });
    console.log(`Đã thêm "${slug}".`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
