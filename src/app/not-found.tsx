import Link from "next/link";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Trang 404 có thương hiệu (áp dụng cho mọi route chưa tồn tại).
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <p className="text-[64px] font-extrabold leading-none text-green">
              404
            </p>
            <h1 className="mt-3 text-[22px] font-bold text-ink">
              Không tìm thấy trang
            </h1>
            <p className="mt-2 text-[14px] text-muted">
              Trang bạn tìm không tồn tại hoặc đã được di chuyển.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d"
              >
                Về trang chủ
              </Link>
              <Link
                href="/tim-kiem"
                className="inline-flex h-11 items-center rounded-xl border border-line bg-white px-6 text-sm font-semibold text-ink-2 transition hover:border-green hover:text-green-d"
              >
                Tìm sản phẩm
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
