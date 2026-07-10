import { UserIcon } from "@/components/icons";
import { DeleteAdminButton } from "@/components/admin/AdminUsers";
import { Pagination } from "@/components/Pagination";
import { getCustomerUsers } from "@/lib/data";
import type { RawParams } from "@/lib/product-query";

export const metadata = { title: "Khách hàng" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN");
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: RawParams;
}) {
  const page = Math.max(1, Number(searchParams?.trang) || 1);
  const { users, total, totalPages } = await getCustomerUsers(page);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">
        Tài khoản khách hàng ({total})
      </h1>

      {total === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green">
            <UserIcon className="h-7 w-7" />
          </span>
          <p className="text-[15px] font-semibold text-ink">
            Chưa có khách hàng
          </p>
          <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted">
            Tài khoản khách tự đăng ký trên cửa hàng sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Tên</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                  <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">
                      {u.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-2">{u.email}</td>
                    <td className="px-4 py-3 text-ink-2">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {fmtDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <DeleteAdminButton id={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            basePath="/admin/khach-hang"
            searchParams={searchParams}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
