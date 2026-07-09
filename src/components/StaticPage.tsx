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
        <div className="border-b border-line bg-white">
          <Container className="py-6">
            <Breadcrumb items={breadcrumb} />
            <h1 className="mt-2 text-[28px] font-bold text-ink">{title}</h1>
            {lead && (
              <p className="mt-1.5 max-w-2xl text-[14.5px] text-ink-2">{lead}</p>
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
