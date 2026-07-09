"use client";

import { useState } from "react";
import { tradeInSchema } from "@/lib/validations/order";
import { SITE } from "@/lib/site";

// Form thu cũ đổi mới -> gửi về /api/order (email thông báo).

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  address: "",
  model: "",
  upgradeTo: "",
  note: "",
};

export function TradeInForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  function set<K extends keyof typeof values>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { type: "tradein" as const, ...values };
    const result = tradeInSchema.safeParse(payload);
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
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-2xl text-green">
          ✓
        </div>
        <p className="text-[15px] font-semibold text-ink">
          Đã gửi yêu cầu thu cũ!
        </p>
        <p className="mt-1 text-[13.5px] text-muted">
          Chính Nguyễn sẽ liên hệ định giá cho bạn sớm nhất.
        </p>
      </div>
    );
  }

  const input = (err?: string) =>
    `h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink outline-none transition focus:border-green ${
      err ? "border-sale" : "border-line"
    }`;

  const field = (
    key: keyof typeof values,
    label: string,
    required: boolean,
    type = "text",
  ) => (
    <div>
      <input
        type={type}
        className={input(errors[key])}
        placeholder={required ? `${label}*` : label}
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
      />
      {errors[key] && <p className="mt-1 text-[12px] text-sale">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      {field("name", "Họ và tên", true)}
      {field("phone", "Số điện thoại", true, "tel")}
      {field("email", "Email", true, "email")}
      {field("address", "Địa chỉ", true)}
      {field("model", "Tên mẫu máy cần thu", true)}
      {field("upgradeTo", "Sản phẩm bạn cần lên đời (nếu có)", false)}
      <div>
        <textarea
          rows={3}
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-green"
          placeholder="Mô tả ngắn về ngoại hình và tình trạng thiết bị..."
          value={values.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="text-[12.5px] text-sale">
          Gửi thất bại, vui lòng thử lại hoặc gọi hotline {SITE.hotline}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-12 rounded-xl bg-green text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi yêu cầu định giá"}
      </button>
    </form>
  );
}
