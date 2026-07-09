import type { InputHTMLAttributes, ReactNode } from "react";

// Ô nhập dùng chung cho form auth: nhãn + icon trái + input + lỗi.
// Không giữ state -> dùng được trong cả client form.

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  error?: string;
  /** Phần tử bên phải input (VD: nút ẩn/hiện mật khẩu). */
  trailing?: ReactNode;
}

export function AuthField({
  label,
  icon,
  error,
  trailing,
  id,
  className = "",
  ...inputProps
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition focus-within:border-green ${
          error ? "border-sale" : "border-line"
        }`}
      >
        <span className="text-muted">{icon}</span>
        <input
          id={id}
          className={`h-11 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted ${className}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && <p className="mt-1 text-[12px] text-sale">{error}</p>}
    </div>
  );
}
