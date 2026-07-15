"use client";

import { useState } from "react";
import Image from "next/image";

// Gallery ảnh THẬT: ảnh lớn + hàng ảnh nhỏ bấm để đổi. Client Component vì cần
// state chọn ảnh. Máy chưa có ảnh -> ProductGallery (server) vẽ SVG, không vào đây.
// Khung vuông 1:1, object-contain để không cắt mất máy nếu ảnh không vuông.

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
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white to-[#F4F7F4] p-6 shadow-card">
        {badge && (
          <span className="absolute left-4 top-4 z-[2] rounded-full bg-sale px-3 py-1 text-[12px] font-bold text-white">
            {badge}
          </span>
        )}
        <div className="relative mx-auto aspect-square max-w-[460px] overflow-hidden rounded-xl">
          <Image
            src={current}
            alt={name}
            fill
            sizes="(max-width: 900px) 100vw, 460px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
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
    </div>
  );
}
