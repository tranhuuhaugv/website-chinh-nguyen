"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

// Form thêm tài khoản quản trị.
export function AddAdminForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof values>(k: K, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setValues({ name: "", email: "", password: "" });
        router.refresh();
      } else if (res.status === 409) {
        setError("Email này đã tồn tại.");
      } else {
        setError("Không tạo được tài khoản, kiểm tra lại thông tin.");
      }
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-green";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white p-5"
    >
      <h2 className="mb-4 text-[15px] font-bold text-ink">
        Thêm tài khoản quản trị
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          className={input}
          placeholder="Tên"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <input
          className={input}
          type="password"
          placeholder="Mật khẩu (≥ 6 ký tự)"
          value={values.password}
          onChange={(e) => set("password", e.target.value)}
        />
      </div>
      {error && <p className="mt-2 text-[12.5px] text-sale">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 h-10 rounded-xl bg-green px-5 text-sm font-semibold text-white transition hover:bg-green-d disabled:opacity-60"
      >
        {busy ? "Đang tạo..." : "Tạo tài khoản"}
      </button>
    </form>
  );
}

// Nút xóa 1 tài khoản admin.
export function DeleteAdminButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    setBusy(true);
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label="Xóa"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:border-sale hover:text-sale disabled:opacity-50"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
