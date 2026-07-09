"use client";

import { useRef, useState } from "react";
import { TrashIcon } from "@/components/icons";
import { ImageUpload } from "./ImageUpload";

// Soạn nội dung bài viết theo khối: đoạn văn hoặc ảnh (chèn ảnh trong bài).
// Demo: quản lý khối phía client; khi có DB sẽ lưu mảng khối này.

interface Block {
  id: number;
  type: "text" | "image";
  value: string;
}

export function BlogContentEditor() {
  const idRef = useRef(1);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 0, type: "text", value: "" },
  ]);

  function addBlock(type: Block["type"]) {
    setBlocks((b) => [...b, { id: idRef.current++, type, value: "" }]);
  }
  function updateBlock(id: number, value: string) {
    setBlocks((b) => b.map((x) => (x.id === id ? { ...x, value } : x)));
  }
  function removeBlock(id: number) {
    setBlocks((b) => b.filter((x) => x.id !== id));
  }
  function move(id: number, dir: -1 | 1) {
    setBlocks((b) => {
      const i = b.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const next = [...b];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-line p-3">
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => (
          <div key={block.id} className="rounded-lg border border-line bg-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                {block.type === "text" ? "Đoạn văn" : "Ảnh"}
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
            ) : (
              <ImageUpload onChange={(url) => updateBlock(block.id, url)} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => addBlock("text")}
          className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-green hover:text-green-d"
        >
          + Đoạn văn
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
