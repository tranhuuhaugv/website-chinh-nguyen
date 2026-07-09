"use client";

import { useState } from "react";

// Form liên hệ đơn giản. Client Component. TODO: gửi về email/CRM khi có backend.

export function ContactForm() {
  const [values, setValues] = useState({ name: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function set<K extends keyof typeof values>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.phone.trim() || !values.message.trim()) {
      setError("Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung.");
      return;
    }
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="text-[15px] font-semibold text-ink">
          Đã gửi liên hệ thành công!
        </p>
        <p className="mt-1 text-[13.5px] text-muted">
          Cảm ơn bạn, chúng tôi sẽ liên hệ lại sớm nhất. (Demo — sẽ gửi thật khi
          kết nối backend.)
        </p>
      </div>
    );
  }

  const input =
    "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-green";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-line bg-white p-5"
    >
      <h2 className="mb-4 text-[15px] font-bold text-ink">Gửi liên hệ</h2>
      <div className="flex flex-col gap-3">
        <input
          className={input}
          placeholder="Họ và tên"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <input
          className={input}
          placeholder="Số điện thoại"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <textarea
          rows={4}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-green"
          placeholder="Nội dung cần hỗ trợ..."
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
        {error && <p className="text-[12.5px] text-sale">{error}</p>}
        <button
          type="submit"
          className="h-11 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d"
        >
          Gửi liên hệ
        </button>
      </div>
    </form>
  );
}
