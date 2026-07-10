"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/auth/AuthField";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "@/components/icons";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Email hoặc mật khẩu không đúng.");
      }
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        id="email"
        label="Email quản trị"
        type="email"
        autoComplete="username"
        placeholder="admin@example.com"
        icon={<MailIcon className="h-[18px] w-[18px]" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthField
        id="password"
        label="Mật khẩu"
        type={showPass ? "text" : "password"}
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<LockIcon className="h-[18px] w-[18px]" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        trailing={
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="text-muted transition hover:text-ink"
          >
            {showPass ? (
              <EyeOffIcon className="h-[18px] w-[18px]" />
            ) : (
              <EyeIcon className="h-[18px] w-[18px]" />
            )}
          </button>
        }
      />

      {error && <p className="text-[12.5px] text-sale">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
      >
        {submitting ? "Đang đăng nhập..." : "Đăng nhập quản trị"}
      </button>
    </form>
  );
}
