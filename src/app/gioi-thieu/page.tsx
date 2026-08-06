import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { Band } from "@/components/static/Band";
import { PageArticle } from "@/components/static/PageArticle";
import { INFO_PAGES } from "@/lib/policies";
import { getPolicyOverride } from "@/lib/data";
import { SITE } from "@/lib/site";

// Nội dung sửa được ở admin (Trang nội dung -> Giới thiệu). Ưu tiên bản DB,
// chưa sửa thì dùng bản mặc định. ISR: tự làm mới khi admin lưu.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const p = (await getPolicyOverride("gioi-thieu")) ?? INFO_PAGES["gioi-thieu"];
  return { title: p.title, description: p.lead };
}

export default async function AboutPage() {
  const page =
    (await getPolicyOverride("gioi-thieu")) ?? INFO_PAGES["gioi-thieu"];

  return (
    <StaticPage
      title={page.title}
      lead={page.lead}
      breadcrumb={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]}
    >
      <Band tone="white">
        <PageArticle intro={page.intro} sections={page.sections} />

        <div className="mt-11 max-w-3xl rounded-2xl bg-green-tint px-6 py-5 text-[14.5px] text-ink-2">
          Cần tư vấn chọn máy? Gọi hotline{" "}
          <b className="text-green-d">{SITE.hotline}</b> hoặc{" "}
          <Link
            href="/lien-he"
            className="font-semibold text-green-d hover:underline"
          >
            liên hệ với chúng tôi
          </Link>
          .
        </div>
      </Band>
    </StaticPage>
  );
}
