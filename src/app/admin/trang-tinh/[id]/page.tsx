import { notFound } from "next/navigation";
import { PolicyEditor } from "@/components/admin/PolicyEditor";
import {
  EDITABLE_PAGES,
  isFixedPage,
  isValidPageSlug,
  pagePublicPath,
} from "@/lib/policies";
import { getPolicyOverride } from "@/lib/data";

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

  return (
    <PolicyEditor
      id={id}
      policy={policy}
      path={pagePublicPath(id)}
      canEditPath={!fixed}
    />
  );
}
