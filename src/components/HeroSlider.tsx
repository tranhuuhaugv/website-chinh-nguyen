"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/types";
import { Container } from "./Container";
import { HeroSlideArt } from "./HeroSlideArt";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const AUTOPLAY_MS = 5000;

// Banner chính dạng slide (carousel). Client Component vì cần tự chạy + điều khiển.
// Thêm banner: chỉ cần thêm object vào HERO_SLIDES (mock-data.ts).

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="py-4">
      <Container>
        <h1 className="sr-only">
          Laptop Chính Nguyễn — Laptop chính hãng giá tốt tại Đà Nẵng
        </h1>

        <div className="group relative aspect-[1200/380] w-full overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(11,94,44,0.18)] ring-1 ring-black/5 max-[900px]:aspect-video">
          {/* Track trượt ngang */}
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide) => (
              <Link
                key={slide.id}
                href={slide.href}
                aria-label={`${slide.title1} ${slide.title2 ?? ""}`.trim()}
                className="block h-full w-full shrink-0"
              >
                <HeroSlideArt slide={slide} />
              </Link>
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Banner trước"
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white hover:text-ink group-hover:opacity-100 max-[900px]:opacity-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Banner sau"
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white hover:text-ink group-hover:opacity-100 max-[900px]:opacity-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Tới banner ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-7 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
