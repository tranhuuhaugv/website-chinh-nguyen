import type { Product } from "@/lib/types";
import { Container } from "./Container";
import { CountdownTimer } from "./CountdownTimer";
import { ProductCard } from "./ProductCard";
import { BoltIcon } from "./icons";

// Khối Flash Sale: hộp gradient xanh + đồng hồ đếm ngược + lưới sản phẩm.
// Server Component; chỉ đồng hồ (CountdownTimer) là Client.

// Số lượng "đã bán" mô phỏng cho thanh tiến trình (trên tổng 50 suất).
const FLASH_SOLD = [38, 25, 42, 15];

export function FlashSale({ products }: { products: Product[] }) {
  return (
    <section className="py-[18px]">
      <Container>
        <div className="rounded-xl bg-gradient-to-r from-green-d to-green px-4 py-3.5">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.18]">
                <BoltIcon className="h-[18px] w-[18px] text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold">Flash Sale hôm nay</h2>
                <small className="text-[12px] text-[#CDEBD6]">
                  Số lượng có hạn — nhanh tay kẻo lỡ
                </small>
              </div>
            </div>
            <CountdownTimer />
          </div>

          <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[460px]:gap-2.5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                progress={{ sold: FLASH_SOLD[i % FLASH_SOLD.length], total: 50 }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
