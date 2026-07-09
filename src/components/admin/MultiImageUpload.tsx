"use client";

import { useRef, useState } from "react";
import { TrashIcon, UploadIcon } from "@/components/icons";
import { cloudinaryReady, uploadImage } from "@/lib/cloudinary";

// Tải NHIỀU ảnh (thư viện ảnh sản phẩm). Chọn/kéo-thả nhiều file cùng lúc.
export function MultiImageUpload({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(value);
  const [busy, setBusy] = useState(false);

  function commit(next: string[]) {
    setImages(next);
    onChange?.(next);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const { url } = await uploadImage(file);
        added.push(url);
      } catch {
        // bỏ qua file lỗi
      }
    }
    if (added.length) commit([...images, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    commit(images.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-[#F5F7F5] bg-cover bg-center"
            style={{ backgroundImage: `url("${url}")` }}
          >
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Xóa ảnh"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink-2 shadow transition hover:text-sale"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line bg-bg text-center transition hover:border-green hover:bg-green-tint/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-soft text-green">
            <UploadIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[11.5px] font-medium text-ink-2">Thêm ảnh</span>
        </button>
      </div>

      {busy && <p className="mt-2 text-[12.5px] text-ink-2">Đang tải ảnh…</p>}
      {!cloudinaryReady && (
        <p className="mt-2 text-[12.5px] text-amber">
          Chế độ demo: ảnh chỉ xem trước, chưa được lưu. Cấu hình Cloudinary để
          tải lên thật.
        </p>
      )}
    </div>
  );
}
