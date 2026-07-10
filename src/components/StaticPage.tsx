import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FloatButtons } from "./FloatButtons";

// Khung trang nội dung tĩnh: dải tiêu đề + (tuỳ chọn) sidebar. Server Component.

export function StaticPage({
  title,
  lead,
  breadcrumb,
  aside,
  children,
}: {
  title: string;
  lead?: string;
  breadcrumb: Crumb[];
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-bg pb-12">
        <div className="relative overflow-hidden border-b border-line bg-white">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-tint via-white to-white" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-green-soft/60 blur-3xl" />
          <Container className="relative py-8 max-[520px]:py-6">
            <Breadcrumb items={breadcrumb} />
            <div className="mt-3 flex items-center gap-3">
              <span className="h-9 w-[5px] shrink-0 rounded-full bg-gradient-to-b from-green to-green-dd" />
              <h1 className="text-[30px] font-extrabold tracking-[-0.02em] text-ink max-[520px]:text-[23px]">
                {title}
              </h1>
            </div>
            {lead && (
              <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-2">
                {lead}
              </p>
            )}
          </Container>
        </div>

        <Container className="pt-6">
          {aside ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
              <aside className="h-fit lg:sticky lg:top-6">{aside}</aside>
              <div className="min-w-0">{children}</div>
            </div>
          ) : (
            children
          )}
        </Container>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
