"use client";

import { useState } from "react";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";
import {
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
} from "@/components/icons";
import { AuthField } from "./AuthField";

export function LoginForm() {
  const [values, setValues] = useState({
    identifier: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [notice, setNotice] = useState("");

  function set<K extends keyof typeof values>(key: K, val: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({
        identifier: fe.identifier?.[0] ?? "",
        password: fe.password?.[0] ?? "",
      });
      return;
    }
    setErrors({});
    // TODO: gọi NextAuth signIn("credentials", ...) khi đã có DB + NextAuth.
    setNotice("Chức năng đăng nhập sẽ hoạt động khi kết nối NextAuth + database.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        id="identifier"
        label="Email hoặc số điện thoại"
        type="text"
        autoComplete="username"
        placeholder="email@example.com"
        icon={<MailIcon className="h-[18px] w-[18px]" />}
        value={values.identifier}
        onChange={(e) => set("identifier", e.target.value)}
        error={errors.identifier}
      />

      <AuthField
        id="password"
        label="Mật khẩu"
        type={showPass ? "text" : "password"}
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<LockIcon className="h-[18px] w-[18px]" />}
        value={values.password}
        onChange={(e) => set("password", e.target.value)}
        error={errors.password}
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

      <div className="flex items-center justify-between text-[13px]">
        <label className="flex cursor-pointer items-center gap-2 text-ink-2">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(e) => set("remember", e.target.checked)}
            className="h-4 w-4 accent-green"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link
          href="/quen-mat-khau"
          className="font-medium text-green-d hover:underline"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {notice && (
        <p className="rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
      >
        Đăng nhập
      </button>

      <div className="flex items-center gap-3 text-[12px] text-muted">
        <span className="h-px flex-1 bg-line" />
        Hoặc
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-line bg-white text-sm font-medium text-ink transition hover:bg-bg"
      >
        <GoogleIcon className="h-[18px] w-[18px]" />
        Tiếp tục với Google
      </button>
    </form>
  );
}
