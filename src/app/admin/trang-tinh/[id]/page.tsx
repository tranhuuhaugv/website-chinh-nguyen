import { notFound } from "next/navigation";
import { PolicyEditor } from "@/components/admin/PolicyEditor";
import { EDITABLE_PAGES, pagePublicPath } from "@/lib/policies";
import { getPolicyOverride } from "@/lib/data";

export const metadata = { title: "Sửa trang nội dung" };
export const dynamic = "force-dynamic";

export default async function EditStaticPage({
  params,
}: {
  params: { id: string };
}) {
  const base = EDITABLE_PAGES[params.id];
  if (!base) notFound();

  // Ưu tiên bản đã lưu DB, chưa có thì lấy bản mặc định.
  const policy = (await getPolicyOverride(params.id)) ?? base;

  return (
    <PolicyEditor
      id={params.id}
      policy={policy}
      path={pagePublicPath(params.id)}
    />
  );
}
