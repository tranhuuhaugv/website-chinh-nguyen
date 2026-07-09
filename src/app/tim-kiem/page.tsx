import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareContext";
import { ALL_PRODUCTS } from "@/lib/mock-data";
import type { RawParams } from "@/lib/product-query";

function getKeyword(sp: RawParams): string {
  return (typeof sp.q === "string" ? sp.q : "").trim();
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: RawParams;
}): Metadata {
  const q = getKeyword(searchParams);
  return {
    title: q ? `Tìm kiếm "${q}"` : "Tìm kiếm sản phẩm",
    // Trang kết quả tìm kiếm không cần index (tránh nội dung mỏng, trùng lặp).
    robots: { index: false, follow: true },
  };
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: RawParams;
}) {
  const q = getKeyword(searchParams);
  const keyword = q.toLowerCase();

  const results = keyword
    ? ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(keyword))
    : ALL_PRODUCTS;

  const brands = Array.from(new Set(results.map((p) => p.brand)));

  return (
    <CompareProvider>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Tìm kiếm" }]}
          />
          <h1 className="mb-1 mt-3 text-[26px] font-bold text-ink">
            {q ? (
              <>
                Kết quả cho “<span className="text-green-d">{q}</span>”
              </>
            ) : (
              "Tìm kiếm sản phẩm"
            )}
          </h1>
          <p className="mb-5 text-[13.5px] text-muted">
            Tìm laptop theo tên, hãng hoặc cấu hình bạn cần.
          </p>

          <ProductBrowser
            basePath="/tim-kiem"
            searchParams={searchParams}
            products={results}
            brands={brands}
            preserve={q ? { q } : {}}
          />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
      <CompareBar />
    </CompareProvider>
  );
}
