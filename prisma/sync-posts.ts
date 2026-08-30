import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../src/lib/mock-data";

// Đưa các bài blog soạn trong code (mock-data) lên DB production.
// Tạo bài còn thiếu (theo slug); chỉ cập nhật lại các bài code-managed trong
// UPDATE_SLUGS bên dưới, nên bài admin tự thêm/sửa qua /admin/blog không bị
// ảnh hưởng. Chạy: `npm run db:sync-posts` (deploy.yml tự chạy trước khi build
// để trang blog render tĩnh có bài mới).

// Chỉ sync các slug liệt kê ở đây (tránh tự ý thêm lại bài admin đã xoá).
const SYNC_SLUGS = [
  "top-10-cua-hang-laptop-cu-da-nang-uy-tin-2026",
  "top-5-cua-hang-mua-laptop-da-nang-chinh-hang-2026",
  "guest-post-kinh-nghiem-mua-laptop-cu-da-nang-cho-sinh-vien",
  "guest-post-checklist-chon-cua-hang-laptop-da-nang-uy-tin",
  "laptop-cu-da-nang-duoi-10-trieu-nen-mua-may-nao",
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

// Các bài do code quản lý nội dung SEO: nếu đã có trong DB thì cập nhật lại.
// Các slug khác vẫn chỉ tạo khi thiếu để không ghi đè bài admin tự sửa.
const UPDATE_SLUGS = new Set([
  "laptop-van-phong-2026-nen-chon-core-i5-hay-core-i7",
  "nen-mua-laptop-moi-hay-laptop-cu-nam-2026",
  "macbook-cu-2026-nen-mua-m1-m2-hay-m3",
]);

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
      if (UPDATE_SLUGS.has(slug)) {
        await prisma.blogPost.update({
          where: { slug },
          data: {
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
        console.log(`Đã cập nhật "${slug}".`);
        continue;
      }
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
