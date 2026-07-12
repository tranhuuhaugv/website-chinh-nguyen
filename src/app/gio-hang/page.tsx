import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatButtons } from "@/components/FloatButtons";
import { CartCheckout } from "@/components/cart/CartCheckout";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Giỏ hàng & Thanh toán",
  robots: { index: false, follow: false },
};

// Trang thanh toán không cache -> đọc user ngay ở server để trạng thái đăng nhập
// + tên/SĐT hiện đúng từ lần render đầu (không chờ /api/me phía client).
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser().catch(() => null);
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
          <CartCheckout
            initialUser={
              user
                ? { name: user.name, phone: user.phone, email: user.email }
                : null
            }
          />
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
