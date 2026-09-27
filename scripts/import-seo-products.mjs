#!/usr/bin/env node
/**
 * Import 143 SEO articles into Product.description/metaTitle/metaDescription.
 *
 * Safe flow:
 *   node scripts/import-seo-products.mjs --dry-run
 *   node scripts/import-seo-products.mjs --apply
 *
 * The script:
 * - reads data/seo-products.json
 * - matches Product.name exactly first, then a normalized name only when unique
 * - refuses to write if any article is unmatched/ambiguous
 * - backs up current description/meta fields before applying
 * - updates only description, metaTitle and metaDescription
 * - runs all updates in one Prisma transaction
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "data", "seo-products.json");
const BACKUP_DIR = path.join(ROOT, "data", "seo-backups");

function loadDotEnv() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalize(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function arg(name) {
  return process.argv.includes(name);
}

if (!arg("--dry-run") && !arg("--apply")) {
  console.log("Dùng:");
  console.log("  node scripts/import-seo-products.mjs --dry-run");
  console.log("  node scripts/import-seo-products.mjs --apply");
  process.exit(1);
}

loadDotEnv();

if (!process.env.DATABASE_URL) {
  console.error("Không tìm thấy DATABASE_URL. Kiểm tra file .env.");
  process.exit(1);
}

if (!fs.existsSync(DATA_FILE)) {
  console.error(`Không tìm thấy ${DATA_FILE}`);
  process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

if (!Array.isArray(articles) || articles.length !== 143) {
  console.error(`File SEO phải có đúng 143 bài. Hiện có: ${articles?.length ?? 0}`);
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  const exact = new Map(products.map((p) => [p.name.trim(), p]));
  const normalized = new Map();

  for (const p of products) {
    const key = normalize(p.name);
    const arr = normalized.get(key) ?? [];
    arr.push(p);
    normalized.set(key, arr);
  }

  const matches = [];
  const problems = [];

  for (const article of articles) {
    const exactMatch = exact.get(String(article.productName).trim());

    if (exactMatch) {
      matches.push({ article, product: exactMatch, method: "exact" });
      continue;
    }

    const candidates = normalized.get(normalize(article.productName)) ?? [];

    if (candidates.length === 1) {
      matches.push({ article, product: candidates[0], method: "normalized" });
    } else if (candidates.length === 0) {
      problems.push({
        type: "NOT_FOUND",
        productName: article.productName,
      });
    } else {
      problems.push({
        type: "AMBIGUOUS",
        productName: article.productName,
        candidates: candidates.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
        })),
      });
    }
  }

  console.log(`\nDatabase Product: ${products.length}`);
  console.log(`Bài SEO:         ${articles.length}`);
  console.log(`Match:            ${matches.length}`);
  console.log(`Lỗi:              ${problems.length}`);

  const exactCount = matches.filter((m) => m.method === "exact").length;
  const normalizedCount = matches.filter((m) => m.method === "normalized").length;
  console.log(`  - exact:        ${exactCount}`);
  console.log(`  - normalized:   ${normalizedCount}`);

  if (problems.length) {
    console.log("\n=== SẢN PHẨM CHƯA MATCH ===");
    for (const p of problems) {
      console.log(`\n[${p.type}] ${p.productName}`);
      if (p.candidates) {
        for (const c of p.candidates) {
          console.log(`  - ${c.name} (${c.id})`);
        }
      }
    }
    console.log("\nChưa ghi dữ liệu. Hãy sửa mapping rồi chạy lại.");
    process.exit(2);
  }

  console.log("\n=== PREVIEW ===");
  for (const m of matches.slice(0, 10)) {
    console.log(`[${m.method}] ${m.product.name}`);
    console.log(`  slug: ${m.product.slug}`);
    console.log(`  meta: ${m.article.metaTitle}`);
  }
  if (matches.length > 10) {
    console.log(`... và ${matches.length - 10} sản phẩm khác.`);
  }

  if (arg("--dry-run")) {
    console.log("\nDRY-RUN: chưa cập nhật database.");
    process.exit(0);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const backupFile = path.join(BACKUP_DIR, `products-seo-${timestamp}.json`);
  const backup = matches.map(({ product }) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
  }));

  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), "utf8");
  console.log(`\nBackup: ${backupFile}`);

  await prisma.$transaction(
    matches.map(({ article, product }) =>
      prisma.product.update({
        where: { id: product.id },
        data: {
          // Prisma Json field: lưu chuỗi HTML; ProductDetailView hiện render
          // trực tiếp chuỗi này bằng dangerouslySetInnerHTML.
          description: article.contentHtml,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
        },
      })
    )
  );

  console.log(`\nĐÃ IMPORT ${matches.length}/143 sản phẩm.`);
  console.log("Chỉ cập nhật: description, metaTitle, metaDescription.");
  console.log("Không cập nhật giá, ảnh, tồn kho, cấu hình hoặc danh mục.");
} catch (error) {
  console.error("\nImport thất bại:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
