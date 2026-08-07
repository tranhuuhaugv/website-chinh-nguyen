import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { pcPartFields } from "@/components/admin/pcpart-fields";
import { getPcPartById } from "@/lib/data";

export const metadata = { title: "Sửa linh kiện" };
export const dynamic = "force-dynamic";

export default async function EditPcPartPage({
  params,
}: {
  params: { id: string };
}) {
  const part = await getPcPartById(params.id);
  if (!part) notFound();

  return (
    <AdminForm
      title="Sửa linh kiện"
      singleColumn
      fields={pcPartFields}
      initialValues={{
        type: part.type,
        name: part.name,
        brand: part.brand ?? "",
        price: String(part.price),
        note: part.note ?? "",
        image: part.image ?? "",
        active: part.active ? "co" : "khong",
        sort: String(part.sort),
      }}
      submitLabel="Lưu thay đổi"
      backHref="/admin/build-pc"
      endpoint="/api/admin/pc-parts"
      method="PUT"
      extra={{ id: part.id }}
    />
  );
}
