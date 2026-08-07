import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPage } from "@/components/StaticPage";
import { Band } from "@/components/static/Band";
import { PageArticle } from "@/components/static/PageArticle";
import { getPolicyOverride } from "@/lib/data";
import { isFixedPage } from "@/lib/policies";

// Trang nội dung TUỲ CHỈNH (admin tự tạo, lưu bảng Page). ISR: tự làm mới khi lưu.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (isFixedPage(params.slug)) return { title: "Không tìm thấy trang" };
  const p = await getPolicyOverride(params.slug);
  return p
    ? { title: p.title, description: p.lead }
    : { title: "Không tìm thấy trang" };
}

export default async function CustomContentPage({
  params,
}: {
  params: { slug: string };
}) {
  // Trang cố định có route riêng -> không hiện lại ở /trang/*.
  if (isFixedPage(params.slug)) notFound();
  const page = await getPolicyOverride(params.slug);
  if (!page) notFound();

  return (
    <StaticPage
      title={page.title}
      lead={page.lead}
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: page.title }]}
    >
      <Band tone="white">
        <PageArticle intro={page.intro} sections={page.sections} />
      </Band>
    </StaticPage>
  );
}
