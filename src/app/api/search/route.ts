import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

// Goi y san pham cho autocomplete o tim kiem. Cong khai (khong can dang nhap).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ products: [] });

  try {
    const products = await searchProducts(q, 6);
    return NextResponse.json(
      {
        products: products.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          oldPrice: p.oldPrice ?? null,
          accent: p.accent,
          // Anh that (neu co) de goi y hien dung anh may; chua co -> accent ve SVG.
          image: p.images?.[0] ?? null,
        })),
      },
      {
        headers: {
          // Cache tai browser/CDN 30s: cung tu khoa khong query DB lai
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    return NextResponse.json({ products: [] });
  }
}
