"use client";

import { useState } from "react";
import { MailIcon } from "@/components/icons";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { AuthField } from "./AuthField";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0] ?? "");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Không gửi được lúc này, vui lòng thử lại sau ít phút");
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-tint px-4 py-4 text-center text-[13.5px] text-green-d">
        Nếu email <b>{email}</b> tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật
        khẩu. Vui lòng kiểm tra hộp thư (cả mục Spam). Link có hiệu lực trong 60
        phút.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="email@example.com"
        icon={<MailIcon className="h-[18px] w-[18px]" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <button
        type="submit"
        disabled={sending}
        className="h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Đang gửi…" : "Gửi hướng dẫn đặt lại"}
      </button>
    </form>
  );
}
