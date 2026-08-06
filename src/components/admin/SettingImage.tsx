"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";

// Upload 1 ảnh và LƯU URL vào Setting (VD ảnh badge Bộ Công Thương gửi về).
// Xóa ảnh -> lưu rỗng (footer sẽ dùng badge mặc định).
export function SettingImage({
  settingKey,
  initial,
}: {
  settingKey: string;
  initial: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  async function save(url: string) {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: url }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <ImageUpload value={initial} onChange={save} ratio="aspect-[3/1]" />
      {status === "saving" && (
        <p className="mt-1.5 text-[12px] text-ink-2">Đang lưu…</p>
      )}
      {status === "done" && (
        <p className="mt-1.5 text-[12px] text-green-d">Đã lưu ✓</p>
      )}
      {status === "error" && (
        <p className="mt-1.5 text-[12px] text-sale">Lưu thất bại</p>
      )}
    </div>
  );
}
