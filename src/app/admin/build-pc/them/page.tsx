import { AdminForm } from "@/components/admin/AdminForm";
import { pcPartFields } from "@/components/admin/pcpart-fields";
import { PC_PART_TYPES } from "@/lib/pc-parts";

export const metadata = { title: "Thêm linh kiện" };
export const dynamic = "force-dynamic";

export default function AddPcPartPage() {
  return (
    <AdminForm
      title="Thêm linh kiện"
      singleColumn
      fields={pcPartFields}
      initialValues={{ type: PC_PART_TYPES[0].key, active: "co", sort: "0" }}
      submitLabel="Thêm linh kiện"
      backHref="/admin/build-pc"
      endpoint="/api/admin/pc-parts"
      method="POST"
    />
  );
}
