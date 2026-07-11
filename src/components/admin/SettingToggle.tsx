"use client";

import { useState } from "react";

// Công tắc cài đặt lưu THẬT vào DB (Setting). Optimistic + báo lỗi nếu thất bại.
export function SettingToggle({
  settingKey,
  initial,
}: {
  settingKey: string;
  initial: boolean;
}) {
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !on;
    setOn(next);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: next ? "true" : "false" }),
      });
      if (!res.ok) setOn(!next); // hoàn tác nếu lỗi
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={toggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ${
        on ? "bg-green" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
