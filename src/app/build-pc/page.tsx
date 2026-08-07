import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { PcBuilder } from "@/components/buildpc/PcBuilder";
import { getPcParts } from "@/lib/data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://laptopchinhnguyen.vn";

export const metadata: Metadata = {
  title: "Build PC — Tự chọn cấu hình máy tính",
  description:
    "Tự xây dựng cấu hình PC theo nhu cầu tại Laptop Chính Nguyễn: chọn CPU, Mainboard, VGA, RAM, ổ cứng, nguồn… và xem tổng chi phí ngay. Tư vấn ráp máy miễn phí tại Đà Nẵng.",
  alternates: { canonical: `${SITE_URL}/build-pc` },
};

// Trang cấu hình cập nhật khi admin sửa linh kiện — ISR 1 giờ là đủ.
export const revalidate = 3600;

export default async function BuildPcPage() {
  const parts = await getPcParts();

  return (
    <>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "PC đồng bộ", href: "/pc" },
              { label: "Build PC" },
            ]}
          />
          <div className="mb-5 mt-3">
            <h1 className="text-[26px] font-bold text-ink max-[640px]:text-[21px]">
              Xây dựng cấu hình PC
            </h1>
            <p className="mt-1 text-[14px] text-ink-2">
              Chọn từng linh kiện theo nhu cầu — tổng chi phí tự cộng. Cần tư vấn
              ráp máy, gọi{" "}
              <a
                href="tel:0936122144"
                className="font-semibold text-green-d hover:underline"
              >
                0936.122.144
              </a>
              .
            </p>
          </div>
          <PcBuilder parts={parts} />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
