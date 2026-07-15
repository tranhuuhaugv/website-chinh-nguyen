"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

// Gallery ảnh THẬT: ảnh lớn có mũi tên/vuốt để lướt + dải ảnh nhỏ 1 HÀNG cũng
// trượt được bằng mũi tên riêng. Máy chưa có ảnh -> ProductGallery (server) vẽ
// SVG, không vào đây. Khung vuông 1:1, object-contain để không cắt mất máy.

/** Vuốt quá ngần này (px) mới tính là chuyển ảnh, tránh nhầm với chạm nhẹ. */
const SWIPE_MIN = 40;
/** Ảnh nhỏ 76px + khoảng cách 12px. */
const THUMB_STEP = 88;

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
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const many = images.length > 1;
  const current = images[active] ?? images[0];

  const go = useCallback(
    (step: number) => {
      if (!many) return;
      setActive((i) => (i + step + images.length) % images.length);
    },
    [images.length, many],
  );

  /** Còn trượt được sang trái/phải không -> ẩn/hiện mũi tên của dải ảnh nhỏ. */
  const syncArrows = useCallback(() => {
    const s = stripRef.current;
    if (!s) return;
    setCanLeft(s.scrollLeft > 1);
    setCanRight(s.scrollLeft + s.clientWidth < s.scrollWidth - 1);
  }, []);

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows, images.length]);

  // Đổi ảnh lớn -> kéo dải ảnh nhỏ cho ảnh đang chọn lộ ra.
  // Tự tính scrollLeft (thay vì scrollIntoView) để chỉ cuộn dải, không trôi trang.
  // Đặt thẳng scrollLeft (không dùng behavior:"smooth"): lướt ảnh nhanh thì các
  // lệnh cuộn mượt gối lên nhau, lệnh sau huỷ lệnh trước -> dải kẹt lại một nhịp
  // và ảnh đang chọn bị che. Nhảy thẳng chỉ vài chục px nên mắt không kịp thấy.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.offsetLeft;
    const right = left + thumb.offsetWidth;
    if (left < strip.scrollLeft) {
      strip.scrollLeft = left;
    } else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollLeft = right - strip.clientWidth;
    }
  }, [active]);

  function scrollStrip(dir: number) {
    stripRef.current?.scrollBy({ left: dir * THUMB_STEP * 3, behavior: "smooth" });
  }

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_MIN) go(dx > 0 ? -1 : 1);
  }

  const bigArrow =
    "absolute top-1/2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink-2 shadow-sm backdrop-blur transition hover:border-green hover:text-green";
  const stripArrow =
    "absolute top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-2 shadow-md transition hover:border-green hover:text-green";

  return (
    <div>
      {/* Ảnh lớn — tràn kín khung (không đệm), nền trắng cho phần thừa của ảnh
          không vuông. object-contain để không cắt mất máy. */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {badge && (
          <span className="absolute left-4 top-4 z-[2] rounded-full bg-sale px-3 py-1 text-[12px] font-bold text-white">
            {badge}
          </span>
        )}

        <div
          className="relative aspect-square w-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={current}
            alt={name}
            fill
            sizes="(max-width: 900px) 100vw, 580px"
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
              className={`${bigArrow} left-3`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh sau"
              className={`${bigArrow} right-3`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Dải ảnh nhỏ: 1 HÀNG, trượt bằng mũi tên riêng (chỉ hiện khi còn trượt được) */}
      {many && (
        <div className="relative mt-3">
          <div
            ref={stripRef}
            onScroll={syncArrows}
            className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${name} - ảnh ${i + 1}`}
                aria-current={i === active}
                className={`aspect-square w-[76px] shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1.5 transition ${
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

          {canLeft && (
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              aria-label="Xem ảnh nhỏ trước đó"
              className={`${stripArrow} -left-2`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
          {canRight && (
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              aria-label="Xem thêm ảnh nhỏ"
              className={`${stripArrow} -right-2`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
