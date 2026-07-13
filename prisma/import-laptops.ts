import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

// Import laptop CŨ từ prisma/used-laptops.json vào DB.
// Upsert theo slug (chạy lại sẽ cập nhật, không nhân đôi). KHÔNG đụng đơn/user.
// Chạy trên VPS: `npm run db:import-laptops`

const prisma = new PrismaClient();

interface Row {
  name: string;
  slug: string;
  brand: string;
  price: number;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  resolution: string;
  os: string;
  condition: string;
  needs: string[];
  note: string;
}

const ACCENT: Record<string, string> = {
  MacBook: "silver", MSI: "red", Acer: "red", Asus: "blue",
  Dell: "dark", HP: "blue", Lenovo: "crimson", Gigabyte: "dark", Surface: "silver",
};

function brandSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function main() {
  const file = path.join(__dirname, "used-laptops.json");
  const rows: Row[] = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Đọc ${rows.length} máy từ used-laptops.json`);

  // Đảm bảo có đủ hãng (tạo hãng mới nếu chưa có, vd Gigabyte/Surface).
  const brandNames = Array.from(new Set(rows.map((r) => r.brand)));
  for (const name of brandNames) {
    await prisma.brand.upsert({
      where: { slug: brandSlug(name) },
      update: {},
      create: { name, slug: brandSlug(name) },
    });
  }
  const brands = await prisma.brand.findMany();
  const brandIdByName = new Map(brands.map((b) => [b.name, b.id]));

  let created = 0, updated = 0, sort = 0;
  const seen = new Set<string>();
  for (const r of rows) {
    let slug = r.slug;
    while (seen.has(slug)) slug = slug + "-2";
    seen.add(slug);
    const brandId = brandIdByName.get(r.brand);
    if (!brandId) { console.warn("Bỏ (thiếu hãng):", r.name); continue; }

    const data = {
      name: r.name,
      brandId,
      price: r.price,
      cpu: r.cpu,
      ram: r.ram,
      storage: r.storage,
      gpu: r.gpu || null,
      screen: r.screen || null,
      resolution: r.resolution || null,
      os: r.os || null,
      warranty: "Bảo hành shop",
      condition: r.condition,
      needs: r.needs,
      accent: ACCENT[r.brand] ?? "dark",
      isNew: false,
      sort: sort++,
    };

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      await prisma.product.update({ where: { slug }, data });
      updated++;
    } else {
      await prisma.product.create({ data: { ...data, slug } });
      created++;
    }
  }
  console.log(`Xong: tạo mới ${created}, cập nhật ${updated}.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
