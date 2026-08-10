import { notFound } from "next/navigation";
import { PolicyEditor } from "@/components/admin/PolicyEditor";
import {
  EDITABLE_PAGES,
  POLICIES,
  isFixedPage,
  isValidPageSlug,
} from "@/lib/policies";
import { getPagePublicPath, getPolicyOverride, getPolicyPublicSlug } from "@/lib/data";

export const metadata = { title: "Sửa trang nội dung" };
export const dynamic = "force-dynamic";

export default async function EditStaticPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { title?: string };
}) {
  const id = params.id;
  const fixed = isFixedPage(id);
  const override = await getPolicyOverride(id);

  // Trang mới (tuỳ chỉnh, chưa lưu) phải có slug hợp lệ.
  if (!fixed && !override && !isValidPageSlug(id)) notFound();

  const base = fixed
    ? EDITABLE_PAGES[id]
    : (override ?? {
        title: searchParams.title ?? "",
        lead: "",
        intro: [],
        sections: [],
      });
  const policy = override ?? base;
  const canEditPath = !!POLICIES[id] || !fixed;
  const publicSlug = await getPolicyPublicSlug(id);

  return (
    <PolicyEditor
      id={id}
      policy={policy}
      path={await getPagePublicPath(id)}
      publicSlug={publicSlug}
      canEditPath={canEditPath}
      pathHelpText={
        POLICIES[id]
          ? "Bạn có thể sửa đường dẫn cho chính sách mặc định."
          : undefined
      }
    />
  );
}
