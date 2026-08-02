"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

// "Đã xem gần đây" — lưu localStorage khi khách mở trang chi tiết, hiện lại các
// máy đã xem trước đó. Hoàn toàn client, không cần backend.

type RV = { slug: string; name: string; price: number; image?: string };
const KEY = "recentlyViewed";

export function RecentlyViewed({ current }: { current: RV }) {
  const [items, setItems] = useState<RV[]>([]);

  useEffect(() => {
    let list: RV[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) list = parsed.filter((x) => x && x.slug);
    } catch {
      /* localStorage lỗi -> bỏ qua */
    }
    // Hiện các máy đã xem TRƯỚC (chưa gồm máy đang mở).
    setItems(list.filter((x) => x.slug !== current.slug).slice(0, 10));
    // Ghi máy hiện tại lên đầu, khử trùng, giữ tối đa 12.
    const next = [current, ...list.filter((x) => x.slug !== current.slug)].slice(
      0,
      12,
    );
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* bỏ qua */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.slug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-[18px] font-bold text-ink">Đã xem gần đây</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/san-pham/${p.slug}`}
            className="w-[168px] shrink-0 rounded-xl border border-line bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="168px"
                  className="object-contain p-1"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[11px] text-muted">
                  Laptop
                </div>
              )}
            </div>
            <p className="mb-1 mt-1.5 line-clamp-2 min-h-[34px] text-[12.5px] font-medium leading-snug text-ink">
              {p.name}
            </p>
            <div className="text-[14px] font-bold text-sale">
              {formatPrice(p.price)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
