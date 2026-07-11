"use client";

import { useRef, useState } from "react";
import { TrashIcon, UploadIcon } from "@/components/icons";
import { uploadImage } from "@/lib/upload";

// Tải 1 ảnh từ máy lên VPS (lưu tại public/uploads, phục vụ ở /uploads/...).

type Status = "idle" | "uploading" | "done" | "error";

export function ImageUpload({
  value,
  onChange,
  ratio = "aspect-[4/3]",
}: {
  value?: string;
  onChange?: (url: string) => void;
  ratio?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value ?? "");
  const [status, setStatus] = useState<Status>(value ? "done" : "idle");

  async function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    setStatus("uploading");
    try {
      const { url } = await uploadImage(file);
      setPreview(url);
      onChange?.(url);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function clear() {
    setPreview("");
    setStatus("idle");
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative w-full max-w-xs">
          <div
            className={`${ratio} w-full overflow-hidden rounded-xl border border-line bg-[#F5F7F5] bg-contain bg-center bg-no-repeat`}
            style={{ backgroundImage: `url("${preview}")` }}
            role="img"
            aria-label="Ảnh xem trước"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-green hover:text-green-d"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-sale hover:text-sale"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-bg px-4 py-8 text-center transition hover:border-green hover:bg-green-tint/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-soft text-green">
            <UploadIcon className="h-5 w-5" />
          </span>
          <span className="text-[13.5px] font-semibold text-ink">
            Chọn ảnh hoặc kéo thả vào đây
          </span>
          <span className="text-[12px] text-muted">PNG, JPG, WEBP…</span>
        </button>
      )}

      {status === "uploading" && (
        <p className="mt-2 text-[12.5px] text-ink-2">Đang tải ảnh lên…</p>
      )}
      {status === "done" && (
        <p className="mt-2 text-[12.5px] text-green-d">Đã tải lên thành công.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[12.5px] text-sale">
          Tải lên thất bại, vui lòng thử lại.
        </p>
      )}
    </div>
  );
}
