"use client";

import { useState } from "react";
import { z } from "zod";
import { MailIcon } from "@/components/icons";
import { AuthField } from "./AuthField";

const schema = z.object({ email: z.string().email("Email không hợp lệ") });

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0] ?? "");
      return;
    }
    setError("");
    // TODO: gọi API gửi email đặt lại mật khẩu khi có backend.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-tint px-4 py-4 text-center text-[13.5px] text-green-d">
        Nếu email <b>{email}</b> tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật
        khẩu. Vui lòng kiểm tra hộp thư. (Demo — sẽ gửi thật khi có backend.)
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
        className="h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
      >
        Gửi hướng dẫn đặt lại
      </button>
    </form>
  );
}
