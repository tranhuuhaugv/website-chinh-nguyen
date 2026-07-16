"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon } from "@/components/icons";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { AuthField } from "./AuthField";

// Đặt mật khẩu mới bằng token trong link email.

const LOI: Record<string, string> = {
  invalid_token:
    "Link đã hết hạn hoặc đã dùng rồi. Vui lòng yêu cầu gửi lại link mới.",
  failed: "Có lỗi xảy ra, vui lòng thử lại sau ít phút",
};

export function ResetPasswordForm({ token }: { token: string }) {
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chung, setChung] = useState("");
  const [hien, setHien] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse({ ...values, token });
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
    setChung("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !json?.ok) {
        setChung(LOI[json?.error ?? ""] ?? "Không đặt lại được mật khẩu");
      } else {
        setDone(true);
      }
    } catch {
      setChung("Lỗi kết nối, vui lòng thử lại");
    }
    setSending(false);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-green-tint px-4 py-4 text-[13.5px] text-green-d">
          <CheckIcon className="h-4 w-4 shrink-0" />
          Đã đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
        </div>
        <Link
          href="/dang-nhap"
          className="flex h-11 items-center justify-center rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  const matHienIcon = hien ? (
    <EyeOffIcon className="h-[18px] w-[18px]" />
  ) : (
    <EyeIcon className="h-[18px] w-[18px]" />
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        id="password"
        label="Mật khẩu mới"
        type={hien ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Tối thiểu 6 ký tự"
        icon={<LockIcon className="h-[18px] w-[18px]" />}
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        error={errors.password}
        trailing={
          <button
            type="button"
            onClick={() => setHien((v) => !v)}
            aria-label={hien ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="text-muted transition hover:text-ink-2"
          >
            {matHienIcon}
          </button>
        }
      />
      <AuthField
        id="confirmPassword"
        label="Nhập lại mật khẩu mới"
        type={hien ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Nhập lại mật khẩu"
        icon={<LockIcon className="h-[18px] w-[18px]" />}
        value={values.confirmPassword}
        onChange={(e) =>
          setValues((v) => ({ ...v, confirmPassword: e.target.value }))
        }
        error={errors.confirmPassword}
      />

      {chung && (
        <p className="rounded-xl bg-sale/10 px-3.5 py-2.5 text-[12.5px] text-sale">
          {chung}{" "}
          <Link href="/quen-mat-khau" className="font-semibold underline">
            Gửi lại link
          </Link>
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Đang lưu…" : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
}
