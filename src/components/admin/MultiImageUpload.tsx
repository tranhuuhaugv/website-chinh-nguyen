"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon, TrashIcon, UploadIcon } from "@/components/icons";
import { uploadImage, uploadImageFromUrl } from "@/lib/upload";

// Tải NHIỀU ảnh (thư viện ảnh sản phẩm). Chọn/kéo-thả nhiều file cùng lúc,
// hoặc dán link ảnh trên web -> server tự tải về VPS.

/** Ảnh vừa chọn, đang nén/tải lên — hiện ngay từ file trong máy. */
interface DangTai {
  id: number;
  localUrl: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  raw = false,
}: {
  value?: string[];
  onChange?: (urls: string[]) => void;
  /** raw = giữ ảnh nguyên gốc, không nén (VD ảnh khách hàng cần nét). */
  raw?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(value);
  const [dangTai, setDangTai] = useState<DangTai[]>([]);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");

  // Kéo-thả sắp xếp thứ tự ảnh: giữ vị trí đang kéo + vị trí đang thả tới (viền xanh).
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Nhiều ảnh tải xong lệch nhau -> đọc mảng mới nhất qua ref, không dùng state
  // cũ trong closure (ảnh xong sau sẽ ghi đè, làm mất ảnh xong trước).
  const imagesRef = useRef<string[]>(value);

  function commit(next: string[]) {
    imagesRef.current = next;
    setImages(next);
    onChange?.(next);
  }

  // Thu hồi các URL tạm khi rời trang (tránh rò bộ nhớ).
  useEffect(() => {
    return () => {
      dangTai.forEach((d) => URL.revokeObjectURL(d.localUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dán 1 hoặc nhiều link (cách nhau bằng xuống dòng/dấu cách) -> tải hết về.
  async function handleLinks() {
    const links = link.split(/[\s\n]+/).filter(Boolean);
    if (!links.length) return;
    setBusy(true);
    setLinkError("");

    const results = await Promise.all(
      links.map((l) =>
        uploadImageFromUrl(l, { raw })
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
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    if (inputRef.current) inputRef.current.value = "";

    // 1) Hiện ảnh NGAY từ file trong máy — không chờ nén + tải lên xong.
    //    (Trước đây await cả loạt rồi mới hiện -> chọn 7 ảnh là ngồi nhìn màn
    //    hình trống tới khi ảnh cuối tải xong.)
    const items = list.map((file, i) => ({
      id: Date.now() + i,
      localUrl: URL.createObjectURL(file),
      file,
    }));
    setDangTai((d) => [...d, ...items.map(({ id, localUrl }) => ({ id, localUrl }))]);

    // 2) Nén + tải ngầm. Ảnh nào xong trước thì vào thư viện trước.
    await Promise.all(
      items.map(async (it) => {
        try {
          const { url } = await uploadImage(it.file, { raw });
          commit([...imagesRef.current, url]);
        } catch {
          // Lỗi -> bỏ ảnh đó, các ảnh khác vẫn tiếp tục.
        } finally {
          setDangTai((d) => d.filter((x) => x.id !== it.id));
          URL.revokeObjectURL(it.localUrl);
        }
      }),
    );
  }

  function removeAt(i: number) {
    commit(images.filter((_, idx) => idx !== i));
  }

  /** Di chuyển ảnh từ vị trí `from` tới `to` (dùng cho kéo-thả sắp xếp). */
  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  }

  /** Đưa ảnh lên đầu = ảnh đại diện. */
  function makeCover(i: number) {
    move(i, 0);
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
            draggable
            onDragStart={(e) => {
              dragIndex.current = i;
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              dragIndex.current = null;
              setOverIndex(null);
            }}
            onDragOver={(e) => {
              // Chỉ nhận khi đang kéo 1 ảnh trong thư viện (không phải file từ máy).
              if (dragIndex.current === null) return;
              e.preventDefault();
              if (overIndex !== i) setOverIndex(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex.current !== null) move(dragIndex.current, i);
              dragIndex.current = null;
              setOverIndex(null);
            }}
            title="Kéo để đổi thứ tự"
            className={`group relative aspect-square cursor-move overflow-hidden rounded-xl border bg-[#F5F7F5] bg-cover bg-center ${
              overIndex === i ? "border-green ring-2 ring-green" : "border-line"
            }`}
            style={{ backgroundImage: `url("${url}")` }}
          >
            {/* Ảnh đầu tiên = ảnh đại diện */}
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-green px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                Đại diện
              </span>
            )}

            {/* Đặt làm đại diện: đưa ảnh này lên đầu (tiện cho cả điện thoại) */}
            {i !== 0 && (
              <button
                type="button"
                onClick={() => makeCover(i)}
                aria-label="Đặt làm ảnh đại diện"
                title="Đặt làm ảnh đại diện"
                className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink-2 opacity-0 shadow transition hover:text-green group-hover:opacity-100"
              >
                <StarIcon className="h-3.5 w-3.5" />
              </button>
            )}

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

        {/* Ảnh vừa chọn, đang nén/tải lên: hiện ngay từ file trong máy. */}
        {dangTai.map((d) => (
          <div
            key={d.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-line bg-[#F5F7F5] bg-cover bg-center"
            style={{ backgroundImage: `url("${d.localUrl}")` }}
          >
            <div className="absolute inset-0 flex items-end justify-center bg-white/45 pb-1.5">
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-medium text-ink-2 shadow-sm">
                Đang tải…
              </span>
            </div>
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

      {images.length > 1 && (
        <p className="mt-2 text-[12px] text-ink-2">
          Kéo ảnh để đổi thứ tự · Ảnh đầu là <b>ảnh đại diện</b> · Rê chuột vào ảnh
          rồi bấm <StarIcon className="inline h-3 w-3 -mt-0.5 text-green" /> để đặt
          làm đại diện.
        </p>
      )}

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
