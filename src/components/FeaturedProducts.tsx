"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Container } from "./Container";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

// Khối "Sản phẩm nổi bật": tab lọc theo hãng. Hiển thị tối đa PAGE_SIZE máy;
// nút "Xem thêm" dẫn sang trang tất cả sản phẩm (không tải thêm tại chỗ).
// Client Component vì cần state cho tab đang chọn.

const PAGE_SIZE = 15;

export function FeaturedProducts({
  products,
  tabs,
}: {
  products: Product[];
  tabs: readonly string[];
}) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const filtered = useMemo(
    () =>
      activeTab === tabs[0]
        ? products
        : products.filter((p) => p.brand === activeTab),
    [activeTab, products, tabs],
  );

  const shown = filtered.slice(0, PAGE_SIZE);

  function selectTab(tab: string) {
    setActiveTab(tab);
  }

  return (
    <section className="py-[18px]">
      <Container>
        <SectionHead
          title="Sản phẩm nổi bật"
          subtitle="Laptop chính hãng, giá tốt được chọn lọc mỗi ngày"
          moreHref="/san-pham"
        />

        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => selectTab(tab)}
                className={`rounded-full px-4 py-[7px] text-[13.5px] transition ${
                  active
                    ? "bg-gradient-to-r from-green-d to-green font-semibold text-white shadow-[0_4px_12px_rgba(11,94,44,.30)]"
                    : "border border-line bg-white font-medium text-ink-2 hover:border-green hover:text-green-d"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-5 gap-4 max-[1100px]:grid-cols-4 max-[900px]:grid-cols-2 max-[460px]:gap-2.5">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} showBuy={false} />
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            href="/san-pham"
            className="rounded-lg border border-green bg-white px-8 py-[11px] text-sm font-semibold text-green-d transition hover:bg-green hover:text-white"
          >
            Xem thêm sản phẩm
          </Link>
        </div>
      </Container>
    </section>
  );
}
