import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticPage } from "@/components/StaticPage";
import { Band } from "@/components/static/Band";
import { Container } from "@/components/Container";
import { SITE } from "@/lib/site";
import { CheckIcon } from "@/components/icons";
import { POLICIES } from "@/lib/policies";
import {
  getCustomPages,
  getPolicyNavItems,
  getPolicyOverride,
  resolvePolicySlug,
} from "@/lib/data";

// Nội dung có thể được admin sửa (lưu DB) — ưu tiên bản DB, không có thì dùng
// bản mặc định trong lib/policies. ISR: tự làm mới + revalidate khi admin lưu.
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const policyKey = await resolvePolicySlug(params.slug);
  const policy = (await getPolicyOverride(policyKey)) ?? POLICIES[policyKey];
  return {
    title: policy?.title ?? "Chính sách",
    description: policy?.lead,
  };
}

export default async function PolicyPage({
  params,
}: {
  params: { slug: string };
}) {
  const policyKey = await resolvePolicySlug(params.slug);
  const policy = (await getPolicyOverride(policyKey)) ?? POLICIES[policyKey];
  if (!policy) notFound();

  const activeHref = `/chinh-sach/${params.slug}`;
  const [fixedNav, customPages] = await Promise.all([
    getPolicyNavItems(),
    getCustomPages(),
  ]);
  const policyNav = [
    ...fixedNav,
    ...customPages.map((page) => ({
      label: page.title,
      href: `/chinh-sach/${page.slug}`,
    })),
  ];

  return (
    <StaticPage
      title={policy.title}
      lead={policy.lead}
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Chính sách", href: "/chinh-sach/bao-hanh" },
        { label: policy.title },
      ]}
    >
      {/* Thanh điều hướng chính sách (ngang, cuộn được) */}
      <div className="border-b border-line bg-white">
        <Container>
          <nav className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {policyNav.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] transition ${
                    active
                      ? "bg-gradient-to-r from-green-d to-green font-semibold text-white shadow-[0_4px_12px_rgba(11,94,44,.28)]"
                      : "border border-line font-medium text-ink-2 hover:border-green hover:text-green-d"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      {/* Nội dung chính sách — dạng bài viết sạch, ít khung */}
      <Band tone="white">
        <article className="max-w-3xl">
          <div className="flex flex-col gap-4 border-l-[3px] border-green pl-6 text-[15.5px] leading-[1.8] text-ink-2">
            {policy.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {policy.sections.map((section) => (
            <div
              key={section.heading}
              className="mt-10 border-t border-line pt-9"
            >
              <h2 className="flex items-center gap-3 text-[19px] font-bold text-ink">
                <span className="h-6 w-[4px] shrink-0 rounded-full bg-gradient-to-b from-green to-green-dd" />
                {section.heading}
              </h2>
              {section.paragraphs?.map((para, i) => (
                <p
                  key={i}
                  className="mt-3.5 text-[15px] leading-[1.8] text-ink-2"
                >
                  {para}
                </p>
              ))}
              {section.items && (
                <ul className="mt-4 flex flex-col gap-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-[1.7] text-ink-2"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-11 rounded-2xl bg-green-tint px-6 py-5 text-[14.5px] text-ink-2">
            Cần hỗ trợ thêm? Gọi hotline{" "}
            <b className="text-green-d">{SITE.hotline}</b> hoặc{" "}
            <Link
              href="/lien-he"
              className="font-semibold text-green-d hover:underline"
            >
              liên hệ với chúng tôi
            </Link>
            .
          </div>
        </article>
      </Band>
    </StaticPage>
  );
}
