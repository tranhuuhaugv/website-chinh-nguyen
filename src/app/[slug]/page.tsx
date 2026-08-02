import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductDetailView,
  buildProductMetadata,
} from "@/components/product/ProductDetailView";
import {
  CategoryView,
  buildCategoryMetadata,
} from "@/components/category/CategoryView";
import {
  getAllProductSlugs,
  getBrandBySlug,
  getCategories,
  getCategorySeo,
  getProductBySlug,
} from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

// Route GỐC: URL rút gọn không tiền tố. 1 slug có thể là DANH MỤC (hãng / dòng
// máy / nhu cầu / loại) hoặc SẢN PHẨM. Ưu tiên danh mục trước, rồi sản phẩm.
// Link cũ /san-pham/<slug> & /danh-muc/<slug> được 301 về đây (next.config.mjs).
export const revalidate = 3600;

export async function generateStaticParams() {
  const [productSlugs, cats] = await Promise.all([
    getAllProductSlugs(),
    getCategories(),
  ]);
  const all = new Set<string>([...productSlugs, ...cats.map((c) => c.slug)]);
  return Array.from(all).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const category = await getCategorySeo(slug);
  const brand = category ? null : await getBrandBySlug(slug);
  if (category || brand) return buildCategoryMetadata(category, slug);
  const product = await getProductBySlug(slug);
  if (product) return buildProductMetadata(product);
  return { title: "Không tìm thấy trang" };
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: RawParams;
}) {
  const slug = params.slug;
  const [category, brand] = await Promise.all([
    getCategorySeo(slug),
    getBrandBySlug(slug),
  ]);
  if (category || brand) {
    return <CategoryView slug={slug} searchParams={searchParams} />;
  }
  const product = await getProductBySlug(slug);
  if (product) return <ProductDetailView slug={slug} />;
  notFound();
}
