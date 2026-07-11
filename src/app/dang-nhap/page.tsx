import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Đăng nhập",
  // Trang tài khoản: không cho index (quy tắc SEO trong CLAUDE.md).
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Đã đăng nhập rồi thì vào thẳng trang tài khoản, không hiện lại form.
  if (await getCurrentUser()) redirect("/tai-khoan");

  return (
    <AuthShell
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại Laptop Chính Nguyễn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-green-d hover:underline">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
