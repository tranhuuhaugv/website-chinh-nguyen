"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiImageUpload } from "./MultiImageUpload";

// Quản lý ảnh "Không gian & hoạt động cửa hàng" hiện ở trang Giới thiệu.
// Lưu Setting "aboutPhotos" (JSON mảng URL). Ảnh giữ nguyên gốc (raw) cho nét.
export function AboutPhotosManager({ initial }: { initial: string[] }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "aboutPhotos",
          value: JSON.stringify(images),
        }),
      });
      if (res.ok) {
        setStatus("done");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-[15px] font-bold text-ink">
        Ảnh không gian cửa hàng ({images.length})
      </h2>
      <p className="mb-4 text-[13px] text-muted">
        Tải ảnh không gian &amp; hoạt động tại cửa hàng — sẽ hiện thành khối ảnh ở
        trang Giới thiệu. Chưa có ảnh thì khối này không hiện.
      </p>

      <MultiImageUpload raw value={images} onChange={setImages} />

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="h-10 rounded-xl bg-gradient-to-r from-green-d to-green px-6 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(11,94,44,.25)] transition hover:shadow-[0_6px_16px_rgba(11,94,44,.38)] disabled:opacity-60"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        {status === "done" && (
          <span className="text-[13px] font-medium text-green-d">
            Đã lưu! Trang Giới thiệu sẽ cập nhật sau ít phút.
          </span>
        )}
        {status === "error" && (
          <span className="text-[13px] font-medium text-sale">
            Lưu thất bại, thử lại.
          </span>
        )}
      </div>
    </div>
  );
}
