"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// Hàng sản phẩm Flash Sale cuộn ngang: TỰ CHẠY (auto-play) + nút ‹ › + kéo chuột.
// Dừng auto khi rê chuột / đang kéo; tôn trọng "giảm chuyển động".
// Wrapper Client; các thẻ bên trong vẫn render phía server (truyền qua children).

export function FlashSlider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Trạng thái kéo chuột (dùng ref để không re-render mỗi lần di chuột).
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const paused = useRef(false);

  // Auto-play: cứ mỗi 3s trượt sang phải 1 nhịp; tới cuối thì quay về đầu.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (paused.current || !el) return;
      // Không có gì để cuộn (đủ chỗ) -> bỏ qua.
      if (el.scrollWidth - el.clientWidth < 8) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: Math.round(el.clientWidth * 0.85), behavior: "smooth" });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  function slide(dir: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  }

  function onDown(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    drag.current = { down: true, startX: e.pageX, startLeft: el.scrollLeft, moved: false };
  }
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    const d = drag.current;
    if (!el || !d.down) return;
    const dx = e.pageX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.startLeft - dx;
  }
  function endDrag() {
    drag.current.down = false;
  }
  function onEnter() {
    paused.current = true;
  }
  function onLeave() {
    paused.current = false;
    endDrag();
  }
  // Vừa kéo xong thì chặn cú click mở link của thẻ.
  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={endDrag}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClickCapture={onClickCapture}
        className="flex select-none gap-3 overflow-x-auto px-0.5 py-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        {children}
      </div>

      {/* Nút trượt — ẩn trên mobile (đã vuốt được) */}
      <button
        type="button"
        aria-label="Sản phẩm trước"
        onClick={() => slide(-1)}
        className="absolute left-1 top-[42%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-black max-[640px]:hidden"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Sản phẩm sau"
        onClick={() => slide(1)}
        className="absolute right-1 top-[42%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-black max-[640px]:hidden"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
