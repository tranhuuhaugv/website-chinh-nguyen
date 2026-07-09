import { CartIcon } from "@/components/icons";

export const metadata = { title: "Đơn hàng" };

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Quản lý đơn hàng</h1>
      <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green">
          <CartIcon className="h-7 w-7" />
        </span>
        <p className="text-[15px] font-semibold text-ink">Chưa có đơn hàng</p>
        <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted">
          Hiện các đơn (mua hàng &amp; thu cũ đổi mới) được gửi qua email về
          Gmail của cửa hàng. Danh sách đơn lưu lại tại đây sẽ hiển thị khi kết
          nối database.
        </p>
      </div>
    </div>
  );
}
