import { getOrders } from "@/lib/data";
import {
  OrdersManager,
  type AdminOrder,
  type AdminOrderItem,
} from "@/components/admin/OrdersManager";

export const metadata = { title: "Đơn hàng" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rows = await getOrders();

  // Chuyển về shape phẳng (Date -> chuỗi, items JSON -> mảng) cho Client Component.
  const orders: AdminOrder[] = rows.map((o) => ({
    id: o.id,
    type: o.type,
    name: o.name,
    phone: o.phone,
    email: o.email,
    address: o.address,
    note: o.note,
    total: o.total,
    model: o.model,
    upgradeTo: o.upgradeTo,
    items: Array.isArray(o.items) ? (o.items as unknown as AdminOrderItem[]) : [],
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersManager orders={orders} />;
}
