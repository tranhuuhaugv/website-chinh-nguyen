import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/dang-nhap");

  const fields: [string, string][] = [
    ["Họ và tên", user.name ?? "—"],
    ["Email", user.email],
    ["Số điện thoại", user.phone ?? "—"],
    ["Ngày tham gia", new Date(user.createdAt).toLocaleDateString("vi-VN")],
  ];

  return (
    <AccountShell
      activeHref="/tai-khoan"
      crumbLabel="Thông tin tài khoản"
      title="Tài khoản của tôi"
      userName={user.name ?? undefined}
    >
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-4 text-[15px] font-bold text-ink">
          Thông tin tài khoản
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12.5px] text-muted">{k}</dt>
              <dd className="text-[14px] font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </AccountShell>
  );
}
