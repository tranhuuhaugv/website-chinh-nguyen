import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  // Trang tài khoản: không cho index (quy tắc SEO trong CLAUDE.md).
  robots: { index: false, follow: false },
};

export default function LoginPage() {
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
