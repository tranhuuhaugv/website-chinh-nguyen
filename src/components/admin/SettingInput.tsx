"use client";

import { useState } from "react";

// Ô nhập 1 cài đặt dạng chữ (VD link nút liên hệ) lưu THẬT vào DB (Setting).
export function SettingInput({
  settingKey,
  initial,
  placeholder,
}: {
  settingKey: string;
  initial: string;
  placeholder?: string;
}) {
  const [val, setVal] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const dirty = val.trim() !== saved.trim();

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: val.trim() }),
      });
      if (res.ok) {
        setSaved(val.trim());
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        placeholder={placeholder}
        className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-[13.5px] text-ink outline-none transition focus:border-green"
      />
      <button
        type="button"
        onClick={save}
        disabled={!dirty || status === "saving"}
        className="h-10 shrink-0 rounded-lg bg-green px-4 text-[13px] font-semibold text-white transition hover:bg-green-d disabled:opacity-50"
      >
        {status === "saving" ? "Đang lưu…" : "Lưu"}
      </button>
      <span className="w-14 shrink-0 text-[12.5px]">
        {status === "done" && !dirty && (
          <span className="text-green-d">Đã lưu ✓</span>
        )}
        {status === "error" && <span className="text-sale">Lỗi</span>}
      </span>
    </div>
  );
}
