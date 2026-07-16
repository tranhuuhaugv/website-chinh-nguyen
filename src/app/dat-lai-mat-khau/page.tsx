import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = (searchParams?.token ?? "").trim();

  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      subtitle={
        token
          ? "Nhập mật khẩu mới cho tài khoản của bạn."
          : "Link không hợp lệ."
      }
      footer={
        <>
          Nhớ mật khẩu rồi?{" "}
          <Link href="/dang-nhap" className="font-semibold text-green-d hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl bg-sale/10 px-3.5 py-2.5 text-[12.5px] text-sale">
            Link đặt lại mật khẩu không hợp lệ hoặc thiếu mã. Vui lòng yêu cầu
            gửi lại.
          </p>
          <Link
            href="/quen-mat-khau"
            className="flex h-11 items-center justify-center rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
          >
            Gửi lại link đặt lại mật khẩu
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
