import { AddAdminForm, DeleteAdminButton } from "@/components/admin/AdminUsers";
import { getAdminUsers } from "@/lib/data";

export const metadata = { title: "Quản trị viên" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN");
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[20px] font-bold text-ink">Tài khoản quản trị</h1>

      <AddAdminForm />

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-bg text-[12.5px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Tên</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Chưa có tài khoản quản trị nào trong database.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink-2">{u.email}</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteAdminButton id={u.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Tài khoản "admin gốc" trong file <code>.env</code> luôn đăng nhập được và
        không hiển thị ở đây. Các tài khoản tạo tại trang này lưu trong database.
      </p>
    </div>
  );
}
