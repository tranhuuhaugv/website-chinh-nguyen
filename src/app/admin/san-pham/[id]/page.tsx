import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { productFields } from "@/components/admin/product-fields";
import { getAdminBrands, getAdminProductById } from "@/lib/data";

export const metadata = { title: "Sửa sản phẩm" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, brands] = await Promise.all([
    getAdminProductById(params.id),
    getAdminBrands(),
  ]);
  if (!product) notFound();

  const names = brands.map((b) => b.name);
  const s = (v: unknown) => (v == null ? "" : String(v));

  return (
    <AdminForm
      title={`Sửa: ${product.name}`}
      fields={productFields(names)}
      initialValues={{
        name: product.name,
        brand: product.brandName,
        condition: product.condition === "new" ? "new" : "used",
        price: s(product.price),
        oldPrice: s(product.oldPrice),
        cpu: product.cpu,
        ram: product.ram,
        storage: product.storage,
        gpu: s(product.gpu),
        screen: s(product.screen),
        resolution: s(product.resolution),
        refresh: s(product.refresh),
        os: s(product.os),
        battery: s(product.battery),
        weight: s(product.weight),
        ports: s(product.ports),
        warranty: s(product.warranty),
        needs: (product.needs ?? []).join(","),
        images: (product.images ?? []).join(","),
        gift: s(product.gift),
        badge: s(product.badge),
        accent: s(product.accent) || "dark",
        isNew: product.isNew ? "co" : "khong",
        isFlashSale: product.isFlashSale ? "co" : "khong",
        installmentPerMonth: s(product.installmentPerMonth),
        sort: s(product.sort),
        slug: product.slug,
        metaTitle: s(product.metaTitle),
        metaDescription: s(product.metaDescription),
      }}
      submitLabel="Lưu thay đổi"
      backHref="/admin/san-pham"
      endpoint="/api/admin/products"
      method="PUT"
      extra={{ id: product.id }}
    />
  );
}
