import Link from "next/link";
import { Container } from "./Container";
import { SITE } from "@/lib/site";
import type { Category, Store } from "@/lib/types";

// Khối giới thiệu cuối trang chủ: H1 duy nhất của trang (hiển thị thật, không
// ẩn) + đoạn văn chứa từ khoá địa phương + link nội bộ sang danh mục và cửa
// hàng. Chỉ nêu chính sách có thật (bảo hành 12 tháng, dùng thử 15 ngày, trả
// góp, thu cũ đổi mới) — KHÔNG bịa số liệu.
export function HomeIntro({
  categories,
  stores,
}: {
  categories: Category[];
  stores: Store[];
}) {
  const links = categories.slice(0, 12);
  return (
    <section className="py-8">
      <Container>
        <div className="rounded-2xl border border-line bg-white p-6 max-[520px]:p-4">
          <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink max-[520px]:text-[19px]">
            {SITE.name} — Laptop cũ, mới chính hãng giá tốt tại Đà Nẵng
          </h1>
          <div className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
            <p>
              {SITE.name} là địa chỉ mua laptop uy tín tại Đà Nẵng, chuyên laptop
              like new và laptop mới chính hãng: Dell, Lenovo ThinkPad, HP, Asus,
              Acer, MacBook… cho sinh viên, dân văn phòng, đồ hoạ và gaming. Mỗi
              máy đều được kiểm tra kỹ trước khi bán, bảo hành 12 tháng, dùng thử
              15 ngày, hỗ trợ trả góp và thu cũ đổi mới.
            </p>
            {stores.length > 0 && (
              <p>
                Ghé xem máy trực tiếp tại{" "}
                {stores.map((s, i) => (
                  <span key={s.name}>
                    {i > 0 && (i === stores.length - 1 ? " và " : ", ")}
                    <b className="font-semibold text-ink">{s.address}</b>
                  </span>
                ))}{" "}
                — hoặc gọi hotline{" "}
                <a
                  href={`tel:${SITE.hotlineTel}`}
                  className="font-semibold text-green-d"
                >
                  {SITE.hotline}
                </a>{" "}
                để được tư vấn, giao nhanh toàn quốc.{" "}
                <Link
                  href="/he-thong-cua-hang"
                  className="font-semibold text-green-d hover:underline"
                >
                  Xem bản đồ cửa hàng
                </Link>
                .
              </p>
            )}
          </div>
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {links.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-green hover:text-green-d"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
