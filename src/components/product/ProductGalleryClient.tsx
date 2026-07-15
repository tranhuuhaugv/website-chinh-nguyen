"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";

// Gallery ảnh THẬT: ảnh lớn + ảnh nhỏ + chuyển ảnh (mũi tên / vuốt / bàn phím)
// + bấm ảnh để phóng to xem chi tiết (lightbox, zoom 1x-3x, rê để xem quanh).
// Máy chưa có ảnh -> ProductGallery (server) vẽ SVG, không vào đây.
// Khung vuông 1:1, object-contain để không cắt mất máy nếu ảnh không vuông.

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;
/** Vuốt quá ngần này (px) mới tính là chuyển ảnh, tránh nhầm với chạm nhẹ. */
const SWIPE_MIN = 40;

export function ProductGalleryClient({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [scale, setScale] = useState(1);
  // Tâm phóng to, theo % vị trí con trỏ -> zoom đúng chỗ đang nhìn.
  const [origin, setOrigin] = useState("50% 50%");
  const touchX = useRef<number | null>(null);

  const many = images.length > 1;
  const current = images[active] ?? images[0];

  const go = useCallback(
    (step: number) => {
      if (!many) return;
      setActive((i) => (i + step + images.length) % images.length);
      setScale(1);
      setOrigin("50% 50%");
    },
    [images.length, many],
  );

  const closeZoom = useCallback(() => {
    setZoomOpen(false);
    setScale(1);
    setOrigin("50% 50%");
  }, []);

  // Phím tắt khi đang mở lightbox: Esc đóng, mũi tên đổi ảnh.
  useEffect(() => {
    if (!zoomOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeZoom();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    // Khoá cuộn nền để không bị trôi trang phía sau lightbox.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomOpen, go, closeZoom]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_MIN) go(dx > 0 ? -1 : 1);
  }

  /** Rê chuột khi đang phóng to -> dời tâm zoom để xem quanh ảnh. */
  function onMoveZoom(e: React.MouseEvent<HTMLDivElement>) {
    if (scale === 1) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  function zoomBy(step: number) {
    setScale((s) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(s + step).toFixed(1))));
  }

  const arrowCls =
    "absolute top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink-2 shadow-sm backdrop-blur transition hover:border-green hover:text-green";

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white to-[#F4F7F4] p-6 shadow-card">
        {badge && (
          <span className="absolute left-4 top-4 z-[2] rounded-full bg-sale px-3 py-1 text-[12px] font-bold text-white">
            {badge}
          </span>
        )}

        <div
          className="relative mx-auto aspect-square max-w-[460px] cursor-zoom-in overflow-hidden rounded-xl"
          onClick={() => setZoomOpen(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={current}
            alt={name}
            fill
            sizes="(max-width: 900px) 100vw, 460px"
            className="select-none object-contain"
            draggable={false}
            priority
          />
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
              className={`${arrowCls} left-3`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh sau"
              className={`${arrowCls} right-3`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] font-medium text-muted backdrop-blur">
          <SearchIcon className="h-3 w-3" />
          Bấm để phóng to
        </span>
      </div>

      {many && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setActive(i);
                setScale(1);
              }}
              aria-label={`${name} - ảnh ${i + 1}`}
              aria-current={i === active}
              className={`aspect-square w-[76px] overflow-hidden rounded-xl border-2 bg-white p-1.5 transition ${
                i === active ? "border-green" : "border-line hover:border-green/50"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="76px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox phóng to */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh phóng to: ${name}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={closeZoom}
        >
          {/* Thanh công cụ */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[13px] text-white/70">
              {active + 1}/{images.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => zoomBy(-ZOOM_STEP)}
                disabled={scale <= ZOOM_MIN}
                aria-label="Thu nhỏ"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="min-w-[44px] text-center text-[13px] tabular-nums text-white/70">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomBy(ZOOM_STEP)}
                disabled={scale >= ZOOM_MAX}
                aria-label="Phóng to"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeZoom}
                aria-label="Đóng"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Ảnh */}
          <div
            className="relative flex-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={`relative h-full w-full ${
                scale > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => (scale > 1 ? setScale(1) : setScale(2))}
              onMouseMove={onMoveZoom}
            >
              <div
                className="relative h-full w-full"
                style={{ transform: `scale(${scale})`, transformOrigin: origin }}
              >
                <Image
                  src={current}
                  alt={name}
                  fill
                  sizes="100vw"
                  className="select-none object-contain"
                  draggable={false}
                />
              </div>
            </div>

            {many && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Ảnh sau"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
