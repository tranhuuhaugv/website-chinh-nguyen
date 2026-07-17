"use client";

import { useRef, useState } from "react";
import { TrashIcon, UploadIcon } from "@/components/icons";
import { uploadImage, uploadImageFromUrl } from "@/lib/upload";

// Tải NHIỀU ảnh (thư viện ảnh sản phẩm). Chọn/kéo-thả nhiều file cùng lúc,
// hoặc dán link ảnh trên web -> server tự tải về VPS.
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
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");

  function commit(next: string[]) {
    setImages(next);
    onChange?.(next);
  }

  // Dán 1 hoặc nhiều link (cách nhau bằng xuống dòng/dấu cách) -> tải hết về.
  async function handleLinks() {
    const links = link.split(/[\s\n]+/).filter(Boolean);
    if (!links.length) return;
    setBusy(true);
    setLinkError("");

    const results = await Promise.all(
      links.map((l) =>
        uploadImageFromUrl(l)
          .then((r) => ({ url: r.url, err: "" }))
          .catch((e: Error) => ({ url: "", err: e.message })),
      ),
    );
    const added = results.map((r) => r.url).filter(Boolean);
    if (added.length) commit([...images, ...added]);

    const failed = results.filter((r) => !r.url);
    if (failed.length) {
      // Nhiều link hỏng -> báo gọn kèm lỗi đầu tiên, tránh đổ một đống chữ.
      setLinkError(
        failed.length === links.length
          ? failed[0].err
          : `${failed.length}/${links.length} link lỗi (${failed[0].err})`,
      );
    } else {
      setLink("");
    }
    setBusy(false);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    // Upload song song (nén trước ở uploadImage) cho nhanh; giữ đúng thứ tự chọn.
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const results = await Promise.all(
      list.map((file) =>
        uploadImage(file)
          .then((r) => r.url)
          .catch(() => null),
      ),
    );
    const added = results.filter((u): u is string => Boolean(u));
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

      {/* Form giờ tràn hết bề ngang -> thêm cột ở màn hình rộng cho ô ảnh khỏi phình to. */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
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

      {/* Dán link ảnh trên web -> server tải về VPS (không nhúng link người khác). */}
      <div className="mt-3">
        <div className="flex gap-2">
          <input
            type="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLinks();
              }
            }}
            placeholder="Hoặc dán link ảnh (https://...) — nhiều link cách nhau bằng dấu cách"
            className="h-10 flex-1 rounded-xl border border-line bg-white px-3 text-[13px] text-ink outline-none transition focus:border-green"
          />
          <button
            type="button"
            onClick={handleLinks}
            disabled={busy || !link.trim()}
            className="h-10 shrink-0 rounded-xl bg-green px-4 text-[13px] font-semibold text-white transition hover:bg-green-d disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tải về
          </button>
        </div>
        {linkError && (
          <p className="mt-1.5 text-[12.5px] text-sale">{linkError}</p>
        )}
      </div>

      {busy && <p className="mt-2 text-[12.5px] text-ink-2">Đang tải ảnh…</p>}
    </div>
  );
}
