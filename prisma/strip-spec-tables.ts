import { PrismaClient } from "@prisma/client";

// Bỏ bảng thông số ("Thông tin nhanh": CPU / RAM / Ổ cứng...) khỏi BÀI VIẾT mô tả
// sản phẩm, vì trang đã có mục "Thông số kỹ thuật" riêng (bảng trong bài bị lặp).
// - Chỉ xoá bảng có hàng CPU hoặc RAM, kèm tiêu đề "Thông tin nhanh..." đứng ngay trước.
//   Không đụng chữ, ảnh hay bảng khác trong bài.
// - Chạy MỘT LẦN: xong ghi Setting `migration:strip-spec-tables-v1`, các lần deploy sau
//   bỏ qua, nên nếu sau này admin tự chèn bảng thì không bị xoá.
// - Sao lưu mô tả cũ vào Setting `backup:strip-spec-tables-v1` trước khi sửa.
// Chạy tay: `npm run db:strip-spec-tables` (thêm `-- --force` để chạy lại).

const prisma = new PrismaClient();
const FLAG = "migration:strip-spec-tables-v1";
const BACKUP = "backup:strip-spec-tables-v1";

const SPEC = /<th>\s*(CPU|RAM)\s*<\/th>|<td>\s*(CPU|RAM)\s*<\/td>/i;

export function stripSpecTables(html: string): string {
  const block = (t: string) => (SPEC.test(t) ? "" : t);
  let out = html.replace(
    /(?:<h[2-4][^>]*>\s*Thông tin nhanh[\s\S]*?<\/h[2-4]>\s*)?<figure class="table">[\s\S]*?<\/figure>\s*/g,
    (m) => (SPEC.test(m) ? "" : m),
  );
  out = out.replace(
    /(?:<h[2-4][^>]*>\s*Thông tin nhanh[\s\S]*?<\/h[2-4]>\s*)?<table[\s\S]*?<\/table>\s*/g,
    block,
  );
  return out;
}

async function main() {
  const force = process.argv.includes("--force");
  if (!force && (await prisma.setting.findUnique({ where: { key: FLAG } }))) {
    console.log("Đã bỏ bảng thông số trong bài viết trước đây, bỏ qua.");
    return;
  }
  const rows = await prisma.product.findMany({ select: { id: true, slug: true, description: true } });
  const changed: { id: string; slug: string; before: string; after: string }[] = [];
  for (const r of rows) {
    if (typeof r.description !== "string") continue;
    const after = stripSpecTables(r.description);
    if (after !== r.description) changed.push({ id: r.id, slug: r.slug, before: r.description, after });
  }
  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: BACKUP },
      update: { value: JSON.stringify(changed.map(({ id, slug, before }) => ({ id, slug, before }))) },
      create: { key: BACKUP, value: JSON.stringify(changed.map(({ id, slug, before }) => ({ id, slug, before }))) },
    }),
    ...changed.map((c) => prisma.product.update({ where: { id: c.id }, data: { description: c.after } })),
    prisma.setting.upsert({ where: { key: FLAG }, update: { value: new Date().toISOString() }, create: { key: FLAG, value: new Date().toISOString() } }),
  ]);
  for (const c of changed) console.log(`Đã bỏ bảng: ${c.slug}`);
  console.log(`Xong: bỏ bảng thông số trong ${changed.length}/${rows.length} bài viết sản phẩm.`);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
