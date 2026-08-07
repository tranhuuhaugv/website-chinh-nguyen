import { PrismaClient } from "@prisma/client";

// Dọn dữ liệu danh mục cho gọn (chạy mỗi lần deploy, AN TOÀN/idempotent):
//  1) Chuẩn hoá cột `group` về slug (gộp "Theo nhu cầu" ~ "nhu-cau"...) -> hết
//     cảnh 2 nhóm "Nhu cầu" trùng.
//  2) Đổi tên "PC đồng bộ" -> "PC" (chỉ khi còn tên cũ).
//  3) Xếp "PC" + "Màn hình" chung nhóm hãng (group="thuong-hieu") -> hiện cùng
//     Dell... — chỉ đụng khi đang ở "khac"/trống, KHÔNG đè nếu admin đã tự đổi.
// Chạy tay: `npm run db:normalize-categories`.

const prisma = new PrismaClient();

const GROUP_MAP: Record<string, string> = {
  "Theo thương hiệu": "thuong-hieu",
  "Theo nhu cầu": "nhu-cau",
  "Loại máy": "loai-may",
  Khác: "khac",
  "Dòng máy": "dong-may",
};

async function main() {
  // 1) Chuẩn hoá group
  for (const [from, to] of Object.entries(GROUP_MAP)) {
    const r = await prisma.category.updateMany({
      where: { group: from },
      data: { group: to },
    });
    if (r.count) console.log(`group "${from}" -> "${to}": ${r.count}`);
  }

  // 2) Đổi tên PC đồng bộ -> PC
  const renamed = await prisma.category.updateMany({
    where: { slug: "pc", name: "PC đồng bộ" },
    data: { name: "PC" },
  });
  if (renamed.count) console.log('Đổi tên "PC đồng bộ" -> "PC"');

  // 3) PC + Màn hình xếp cùng nhóm hãng (chỉ khi ở "khac"/null)
  const grouped = await prisma.category.updateMany({
    where: {
      slug: { in: ["pc", "man-hinh"] },
      OR: [{ group: "khac" }, { group: null }],
    },
    data: { group: "thuong-hieu" },
  });
  if (grouped.count) console.log(`PC/Màn hình -> nhóm hãng: ${grouped.count}`);

  console.log("normalize-categories xong.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
