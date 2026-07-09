"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUpload } from "./ImageUpload";

// Form generic dùng chung cho các CRUD admin. Sinh input từ cấu hình `fields`.
// UI-first: submit chỉ hiện thông báo (TODO: gọi API lưu vào DB khi có backend).

export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean; // chiếm cả 2 cột
}

export function AdminForm({
  title,
  fields,
  initialValues = {},
  submitLabel = "Lưu",
  backHref,
}: {
  title: string;
  fields: AdminField[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  backHref: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""])),
  );
  const [done, setDone] = useState(false);

  const set = (name: string, val: string) =>
    setValues((v) => ({ ...v, [name]: val }));

  const inputCls =
    "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-green";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href={backHref}
          className="text-[13px] text-muted transition hover:text-green-d"
        >
          ← Quay lại
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="rounded-2xl border border-line bg-white p-6"
      >
        <h1 className="mb-5 text-[17px] font-bold text-ink">{title}</h1>

        {done && (
          <p className="mb-5 rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
            Đã lưu (demo). Dữ liệu sẽ được ghi vào database khi kết nối backend.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.name}
              className={
                f.full || f.type === "textarea" || f.type === "image"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <label className="mb-1.5 block text-[13px] font-medium text-ink">
                {f.label}
              </label>
              {f.type === "image" ? (
                <ImageUpload
                  value={values[f.name]}
                  onChange={(url) => set(f.name, url)}
                />
              ) : f.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={values[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-green"
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={inputCls}
                >
                  <option value="">-- Chọn --</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={values[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="h-11 rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d"
          >
            {submitLabel}
          </button>
          <Link
            href={backHref}
            className="flex h-11 items-center rounded-xl border border-line bg-white px-6 text-sm font-semibold text-ink-2 transition hover:bg-bg"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
