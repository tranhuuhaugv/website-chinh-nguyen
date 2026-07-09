import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu."
      footer={
        <>
          Nhớ mật khẩu rồi?{" "}
          <Link href="/dang-nhap" className="font-semibold text-green-d hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
