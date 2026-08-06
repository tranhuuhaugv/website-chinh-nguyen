import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StaticPage } from "@/components/StaticPage";
import { Band, SectionIntro } from "@/components/static/Band";
import { PageArticle } from "@/components/static/PageArticle";
import { INFO_PAGES } from "@/lib/policies";
import { getAboutPhotos, getPolicyOverride } from "@/lib/data";
import { SITE } from "@/lib/site";

// Nội dung sửa được ở admin (Trang nội dung -> Giới thiệu). Ưu tiên bản DB,
// chưa sửa thì dùng bản mặc định. ISR: tự làm mới khi admin lưu.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const p = (await getPolicyOverride("gioi-thieu")) ?? INFO_PAGES["gioi-thieu"];
  return { title: p.title, description: p.lead };
}

export default async function AboutPage() {
  const [override, photos] = await Promise.all([
    getPolicyOverride("gioi-thieu"),
    getAboutPhotos(),
  ]);
  const page = override ?? INFO_PAGES["gioi-thieu"];

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

      {photos.length > 0 && (
        <Band tone="tint">
          <SectionIntro
            center
            eyebrow="Tại cửa hàng"
            title="Không gian & hoạt động tại cửa hàng"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 max-[520px]:gap-2.5">
            {photos.map((src, i) => (
              <figure
                key={`${src}-${i}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white shadow-card"
              >
                <Image
                  src={src}
                  alt={`Không gian cửa hàng Chính Nguyễn ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 380px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
              </figure>
            ))}
          </div>
        </Band>
      )}
    </StaticPage>
  );
}
