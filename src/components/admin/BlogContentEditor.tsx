"use client";

import { useRef, useState } from "react";
import { TrashIcon } from "@/components/icons";
import { ImageUpload } from "./ImageUpload";

// Soạn nội dung bài viết theo khối: đoạn văn / tiêu đề phụ / ảnh chèn trong bài.
// Controlled: nhận `value` (chuỗi JSON các khối) và báo thay đổi qua `onChange`.

type BlockType = "text" | "heading" | "image";
interface Block {
  id: number;
  type: BlockType;
  value: string;
}

function parseInitial(value?: string): Block[] {
  if (value) {
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr) && arr.length) {
        return arr.map((b, i) => ({
          id: i,
          type:
            b?.type === "heading" || b?.type === "image" ? b.type : "text",
          value: String(b?.value ?? ""),
        }));
      }
    } catch {
      // giá trị cũ dạng văn bản thô -> 1 đoạn văn
      return [{ id: 0, type: "text", value }];
    }
  }
  return [{ id: 0, type: "text", value: "" }];
}

export function BlogContentEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (json: string) => void;
}) {
  const idRef = useRef(1000);
  const [blocks, setBlocks] = useState<Block[]>(() => parseInitial(value));

  // Cập nhật state + phát JSON ra ngoài cho form.
  function commit(next: Block[]) {
    setBlocks(next);
    onChange?.(
      JSON.stringify(next.map(({ type, value }) => ({ type, value }))),
    );
  }

  function addBlock(type: BlockType) {
    commit([...blocks, { id: idRef.current++, type, value: "" }]);
  }
  function updateBlock(id: number, value: string) {
    commit(blocks.map((x) => (x.id === id ? { ...x, value } : x)));
  }
  function removeBlock(id: number) {
    commit(blocks.filter((x) => x.id !== id));
  }
  function move(id: number, dir: -1 | 1) {
    const i = blocks.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  }

  const label: Record<BlockType, string> = {
    text: "Đoạn văn",
    heading: "Tiêu đề phụ",
    image: "Ảnh",
  };

  return (
    <div className="rounded-xl border border-line p-3">
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => (
          <div key={block.id} className="rounded-lg border border-line bg-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                {label[block.type]}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(block.id, -1)}
                  disabled={i === 0}
                  aria-label="Lên"
                  className="flex h-6 w-6 items-center justify-center rounded border border-line text-ink-2 disabled:opacity-40 hover:enabled:text-green-d"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(block.id, 1)}
                  disabled={i === blocks.length - 1}
                  aria-label="Xuống"
                  className="flex h-6 w-6 items-center justify-center rounded border border-line text-ink-2 disabled:opacity-40 hover:enabled:text-green-d"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  aria-label="Xóa khối"
                  className="flex h-6 w-6 items-center justify-center rounded border border-line text-ink-2 hover:border-sale hover:text-sale"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {block.type === "text" ? (
              <textarea
                rows={3}
                value={block.value}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Nhập nội dung đoạn văn..."
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-green"
              />
            ) : block.type === "heading" ? (
              <input
                value={block.value}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Nhập tiêu đề mục..."
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-green"
              />
            ) : (
              <ImageUpload
                value={block.value}
                onChange={(url) => updateBlock(block.id, url)}
                ratio="aspect-video"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addBlock("text")}
          className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-green hover:text-green-d"
        >
          + Đoạn văn
        </button>
        <button
          type="button"
          onClick={() => addBlock("heading")}
          className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-green hover:text-green-d"
        >
          + Tiêu đề phụ
        </button>
        <button
          type="button"
          onClick={() => addBlock("image")}
          className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-green hover:text-green-d"
        >
          + Ảnh
        </button>
      </div>
    </div>
  );
}
