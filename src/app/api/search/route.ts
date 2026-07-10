import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

// Gợi ý sản phẩm cho autocomplete ô tìm kiếm. Công khai (không cần đăng nhập).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ products: [] });

  try {
    const products = await searchProducts(q, 6);
    return NextResponse.json({
      products: products.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        accent: p.accent,
      })),
    });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
