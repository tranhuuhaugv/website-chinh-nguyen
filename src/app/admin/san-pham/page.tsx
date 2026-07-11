"use client";

import { ProductAdminList } from "@/components/admin/ProductAdminList";
import { ALL_PRODUCTS } from "@/lib/mock-data";

export default function AdminProductsPage() {
  return <ProductAdminList products={ALL_PRODUCTS} />;
}
