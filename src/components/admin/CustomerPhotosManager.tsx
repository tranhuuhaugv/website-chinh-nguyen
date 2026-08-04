"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiImageUpload } from "./MultiImageUpload";

// Quản lý ảnh khách hàng ở trang chủ: tải nhiều ảnh lên Cloudinary rồi Lưu.

export function CustomerPhotosManager({ initial }: { initial: string[] }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/customer-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
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
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Ảnh khách hàng ({images.length})
        </h2>
        <p className="mb-4 text-[13px] text-muted">
          Tải lên ảnh thực tế khách hàng nhận máy. Ảnh sẽ chạy ngang ở khối
          “Khách hàng của Chính Nguyễn” trên trang chủ. Chưa có ảnh nào thì trang
          chủ hiển thị ô mẫu.
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
              Đã lưu! Trang chủ sẽ cập nhật sau ít phút.
            </span>
          )}
          {status === "error" && (
            <span className="text-[13px] font-medium text-sale">
              Lưu thất bại, thử lại.
            </span>
          )}
        </div>
      </div>

      <p className="rounded-xl bg-green-tint px-4 py-3 text-[12.5px] text-green-d">
        Ảnh khách hàng được lưu <b>GIỮ NGUYÊN GỐC, không nén</b> để nét nhất (tối
        đa 25MB/ảnh). Ảnh càng lớn thì tải càng chậm — nên chọn ảnh vừa phải.
      </p>
    </div>
  );
}
