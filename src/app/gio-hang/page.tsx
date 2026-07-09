import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { CartCheckout } from "@/components/cart/CartCheckout";

export const metadata: Metadata = {
  title: "Giỏ hàng & Thanh toán",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="py-6">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
          />
          <h1 className="mb-5 mt-3 text-[26px] font-bold text-ink">
            Giỏ hàng &amp; Thanh toán
          </h1>
          <CartCheckout />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
