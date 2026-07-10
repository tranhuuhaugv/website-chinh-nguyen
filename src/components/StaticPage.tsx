import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FloatButtons } from "./FloatButtons";

// Khung trang nội dung tĩnh — bố cục "landing": hero mở đầu + các dải (Band)
// full-width do từng trang tự dựng. Server Component.

export function StaticPage({
  title,
  lead,
  breadcrumb,
  hero,
  children,
}: {
  title: string;
  lead?: string;
  breadcrumb: Crumb[];
  /** Nội dung phụ bên phải hero (số liệu, nút...). Tuỳ chọn. */
  hero?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        {/* Hero mở đầu */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-green-tint via-white to-white">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-green-soft/50 blur-3xl" />
          <Container className="relative grid grid-cols-1 items-center gap-8 py-14 max-[600px]:py-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Breadcrumb items={breadcrumb} />
              <h1 className="mt-4 max-w-3xl text-[42px] font-extrabold leading-[1.08] tracking-[-0.025em] text-ink max-[900px]:text-[34px] max-[600px]:text-[27px]">
                {title}
              </h1>
              {lead && (
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2 max-[600px]:text-[14.5px]">
                  {lead}
                </p>
              )}
            </div>
            {hero && <div className="lg:justify-self-end">{hero}</div>}
          </Container>
        </section>

        {children}
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
