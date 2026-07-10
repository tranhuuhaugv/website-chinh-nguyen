import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      title="Đăng nhập quản trị"
      subtitle="Khu vực quản trị — chỉ dành cho người có quyền."
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
