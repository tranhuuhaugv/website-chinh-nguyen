"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";

// Upload 1 ảnh cho MỘT cài đặt (VD logo Bộ Công Thương) và lưu THẬT vào DB
// (Setting). Ảnh tự host tại /uploads; ở đây chỉ lưu đường dẫn vào setting key.
export function SettingImage({
  settingKey,
  initial,
  ratio,
}: {
  settingKey: string;
  initial: string;
  ratio?: string;
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
      <ImageUpload value={initial} onChange={save} ratio={ratio} />
      {status === "saving" && (
        <p className="mt-2 text-[12.5px] text-ink-2">Đang lưu…</p>
      )}
      {status === "done" && (
        <p className="mt-2 text-[12.5px] text-green-d">Đã lưu ảnh ✓</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[12.5px] text-sale">
          Lưu thất bại, vui lòng thử lại.
        </p>
      )}
    </div>
  );
}
