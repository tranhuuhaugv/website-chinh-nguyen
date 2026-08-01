"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import { RichTextEditorLoader } from "./RichTextEditorLoader";
import { slugify } from "@/lib/slug";

// Form generic dùng chung cho các CRUD admin. Sinh input từ cấu hình `fields`.
// Có `endpoint` -> lưu thật vào DB qua API; không có -> chế độ demo (chỉ báo).

export interface AdminField {
  name: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "money" // ô tiền: tự chèn dấu chấm hàng nghìn (2000000 -> 2.000.000)
    | "textarea"
    | "select"
    | "image"
    | "images"
    | "blocks"
    | "checkboxes"
    | "heading";
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean; // chiếm cả 2 cột
  /** Ô text có nút "Tạo" -> sinh slug từ field nguồn (VD "name"). */
  generateFrom?: string;
}

const WIDE_TYPES = new Set([
  "textarea",
  "image",
  "images",
  "blocks",
  "checkboxes",
  "heading",
]);

/** Chèn dấu chấm hàng nghìn: "2000000" (hoặc "2.000.000") -> "2.000.000". */
function formatMoney(raw: string): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
}

export function AdminForm({
  title,
  fields,
  initialValues = {},
  submitLabel = "Lưu",
  backHref,
  endpoint,
  method = "POST",
  extra,
  redirectTo,
  singleColumn = false,
}: {
  title: string;
  fields: AdminField[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  backHref: string;
  /** URL API để lưu thật. Bỏ trống -> chế độ demo (chỉ báo, không lưu). */
  endpoint?: string;
  method?: "POST" | "PUT";
  /** Trường ẩn gửi kèm (vd: originalSlug khi sửa). */
  extra?: Record<string, string>;
  /** Điều hướng sau khi lưu thành công (mặc định = backHref). */
  redirectTo?: string;
  /** Xếp mọi field 1 cột (dễ đọc/điền cho form dài như sản phẩm). */
  singleColumn?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""])),
  );
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (name: string, val: string) =>
    setValues((v) => ({ ...v, [name]: val }));

  async function submit() {
    if (!endpoint) {
      setDone(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...extra }),
      });
      if (res.ok) {
        router.push(redirectTo ?? backHref);
        router.refresh();
      } else {
        setError("Lưu thất bại. Kiểm tra lại thông tin và thử lại.");
      }
    } catch {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-green";

  return (
    <div>
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
          submit();
        }}
        className="rounded-2xl border border-line bg-white p-6"
      >
        <h1 className="mb-5 text-[17px] font-bold text-ink">{title}</h1>

        {done && !endpoint && (
          <p className="mb-5 rounded-lg bg-green-tint px-3 py-2 text-[12.5px] text-green-d">
            Đã lưu (demo). Dữ liệu sẽ được ghi vào database khi kết nối backend.
          </p>
        )}
        {error && (
          <p className="mb-5 rounded-lg bg-sale/10 px-3 py-2 text-[12.5px] text-sale">
            {error}
          </p>
        )}

        {/* singleColumn: xếp dọc 1 cột (form dài như sản phẩm dễ điền). Mặc định:
            màn hình rộng -> 3 cột cho khỏi dài lê thê khi form tràn hết bề ngang. */}
        <div
          className={
            singleColumn
              ? "grid grid-cols-1 gap-4"
              : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          }
        >
          {fields.map((f) => {
            // Tiêu đề mục (ngăn cách các nhóm field)
            if (f.type === "heading") {
              return (
                <div
                  key={f.name}
                  className={`mt-2 border-b border-line pb-2 ${
                    singleColumn ? "" : "sm:col-span-2 xl:col-span-3"
                  }`}
                >
                  <h3 className="text-[14px] font-bold text-ink">{f.label}</h3>
                  {f.placeholder && (
                    <p className="mt-0.5 text-[12px] text-muted">
                      {f.placeholder}
                    </p>
                  )}
                </div>
              );
            }

            const selected = values[f.name]
              ? values[f.name].split(",").filter(Boolean)
              : [];

            return (
            <div
              key={f.name}
              className={
                singleColumn
                  ? ""
                  : // Ô cần cả hàng (ảnh, khối mô tả, tích nhu cầu...) -> chiếm hết cột.
                    // Ô `full` (tên máy, slug...) chỉ cần rộng hơn ô thường -> 2 cột,
                    // không thì ở lưới 3 cột chúng dài lê thê gần 2 mét.
                    WIDE_TYPES.has(f.type ?? "text")
                    ? "sm:col-span-2 xl:col-span-3"
                    : f.full
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
              ) : f.type === "images" ? (
                <MultiImageUpload
                  value={
                    values[f.name] ? values[f.name].split(",").filter(Boolean) : []
                  }
                  onChange={(urls) => set(f.name, urls.join(","))}
                />
              ) : f.type === "blocks" ? (
                <RichTextEditorLoader
                  value={values[f.name]}
                  onChange={(v) => set(f.name, v)}
                />
              ) : f.type === "checkboxes" ? (
                <div className="flex flex-wrap gap-x-6 gap-y-2.5 rounded-xl border border-line bg-bg p-3">
                  {f.options?.map((o) => {
                    const checked = selected.includes(o.value);
                    return (
                      <label
                        key={o.value}
                        className="flex cursor-pointer items-center gap-2 text-[13.5px] text-ink"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            set(
                              f.name,
                              (checked
                                ? selected.filter((x) => x !== o.value)
                                : [...selected, o.value]
                              ).join(","),
                            )
                          }
                          className="h-4 w-4 accent-green"
                        />
                        {o.label}
                      </label>
                    );
                  })}
                </div>
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
              ) : f.type === "money" ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatMoney(values[f.name])}
                  onChange={(e) => set(f.name, formatMoney(e.target.value))}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              ) : f.generateFrom ? (
                // Ô text kèm nút "Tạo" -> sinh slug từ field nguồn (VD tên máy).
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(f.name, slugify(values[f.generateFrom as string] ?? ""))
                    }
                    className="h-11 shrink-0 rounded-xl border border-green bg-white px-4 text-[13px] font-semibold text-green-d transition hover:bg-green-tint"
                  >
                    Tạo
                  </button>
                </div>
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
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-xl bg-green px-6 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
          >
            {busy ? "Đang lưu…" : submitLabel}
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
