import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

// Tạo sẵn các "dòng máy" (Category group="dong-may") phổ biến theo hãng để admin
// gắn sản phẩm vào. CHỈ TẠO dòng còn thiếu (theo slug) — không ghi đè dòng admin
// đã sửa/tạo. Chạy: `npm run db:sync-series` (deploy.yml tự chạy trước khi build).

type Line = { brand: string; icon: string; lines: string[] };

const DATA: Line[] = [
  {
    brand: "Lenovo",
    icon: "lenovo",
    lines: ["ThinkPad", "Legion", "IdeaPad", "Yoga", "ThinkBook", "LOQ"],
  },
  {
    brand: "Dell",
    icon: "dell",
    lines: ["XPS", "Latitude", "Inspiron", "Precision", "Vostro", "Alienware"],
  },
  {
    brand: "HP",
    icon: "hp",
    lines: ["EliteBook", "ProBook", "Pavilion", "Omen", "Victus", "Envy"],
  },
  {
    brand: "Asus",
    icon: "asus",
    lines: ["ROG", "TUF Gaming", "Vivobook", "Zenbook", "ProArt", "ExpertBook"],
  },
  {
    brand: "Acer",
    icon: "acer",
    lines: ["Nitro", "Predator", "Aspire", "Swift", "TravelMate"],
  },
  {
    brand: "MSI",
    icon: "msi",
    lines: ["Katana", "Cyborg", "Stealth", "Raider", "Modern", "Creator"],
  },
  {
    brand: "MacBook",
    icon: "macbook",
    lines: ["MacBook Air", "MacBook Pro"],
  },
];

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  let sort = 100; // đặt sau các danh mục sẵn có
  for (const { brand, icon, lines } of DATA) {
    for (const line of lines) {
      const name = `${brand} ${line}`;
      const slug = slugify(name);
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) continue; // giữ nguyên dòng admin đã có
      await prisma.category.create({
        data: {
          name,
          slug,
          icon,
          group: "dong-may",
          sort: sort++,
          metaDescription: `Mua ${name} chính hãng, giá tốt tại Laptop Chính Nguyễn. Trả góp 0%, bảo hành uy tín, giao nhanh tại Đà Nẵng.`,
        },
      });
      created++;
      console.log(`+ ${name} (${slug})`);
    }
  }
  console.log(`Đã tạo ${created} dòng máy mới.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
