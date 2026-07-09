"use client";

import { useState } from "react";
import Link from "next/link";
import { registerSchema } from "@/lib/validations/auth";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "@/components/icons";
import { AuthField } from "./AuthField";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

export function RegisterForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [notice, setNotice] = useState("");

  function set<K extends keyof typeof values>(key: K, val: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    const result = registerSchema.safeParse(values);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""]),
        ),
      );
      return;
    }
    setErrors({});
    // TODO: gọi API tạo tài khoản (Prisma) rồi tự đăng nhập khi đã có backend.
    setNotice("Chức năng đăng ký sẽ hoạt động khi kết nối database + NextAuth.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        id="name"
        label="Họ và tên"
        type="text"
        autoComplete="name"
        placeholder="Nguyễn Văn A"
        icon={<UserIcon className="h-[18px] w-[18px]" />}
        value={values.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
      />

      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="email@example.com"
        icon={<MailIcon className="h-[18px] w-[18px]" />}
        value={values.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors.email}
      />

      <AuthField
        id="phone"
        label="Số điện thoại"
        type="tel"
        autoComplete="tel"
        placeholder="0912345678"
        icon={<PhoneIcon className="h-[18px] w-[18px]" />}
        value={values.phone}
        onChange={(e) => set("phone", e.target.value)}
        error={errors.phone}
      />

      <AuthField
        id="password"
        label="Mật khẩu"
        type={showPass ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Tối thiểu 6 ký tự"
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

      <AuthField
        id="confirmPassword"
        label="Nhập lại mật khẩu"
        type={showPass ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Nhập lại mật khẩu"
        icon={<LockIcon className="h-[18px] w-[18px]" />}
        value={values.confirmPassword}
        onChange={(e) => set("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
      />

      <label className="flex cursor-pointer items-start gap-2 text-[13px] text-ink-2">
        <input
          type="checkbox"
          checked={values.agree}
          onChange={(e) => set("agree", e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-green"
        />
        <span>
          Tôi đồng ý với{" "}
          <Link
            href="/chinh-sach/dieu-khoan"
            className="font-medium text-green-d hover:underline"
          >
            Điều khoản
          </Link>{" "}
          và{" "}
          <Link
            href="/chinh-sach/bao-mat"
            className="font-medium text-green-d hover:underline"
          >
            Chính sách bảo mật
          </Link>
        </span>
      </label>
      {errors.agree && <p className="-mt-2 text-[12px] text-sale">{errors.agree}</p>}

      {notice && (
        <p className="rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
      >
        Tạo tài khoản
      </button>
    </form>
  );
}
