"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BannerItem } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

// Quản lý banner trang chủ: 3 slide hero + 2 banner treo bên. Lưu thật vào DB.

type Slot = { image: string; href: string };

const emptySlots = (n: number, from: BannerItem[]): Slot[] =>
  Array.from({ length: n }, (_, i) => ({
    image: from[i]?.image ?? "",
    href: from[i]?.href ?? "",
  }));

function SlotEditor({
  label,
  ratio,
  slot,
  onChange,
}: {
  label: string;
  ratio: string;
  slot: Slot;
  onChange: (s: Slot) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-ink">{label}</p>
      <ImageUpload
        value={slot.image}
        ratio={ratio}
        onChange={(url) => onChange({ ...slot, image: url })}
      />
      <input
        value={slot.href}
        onChange={(e) => onChange({ ...slot, href: e.target.value })}
        placeholder="Link khi bấm vào (vd /san-pham)"
        className="mt-2 h-9 w-full max-w-xs rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-green"
      />
    </div>
  );
}

export function BannerManager({
  initialHero,
  initialSide,
}: {
  initialHero: BannerItem[];
  initialSide: BannerItem[];
}) {
  const router = useRouter();
  const [hero, setHero] = useState<Slot[]>(emptySlots(3, initialHero));
  const [side, setSide] = useState<Slot[]>(emptySlots(2, initialSide));
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  function setHeroAt(i: number, s: Slot) {
    setHero((prev) => prev.map((x, idx) => (idx === i ? s : x)));
  }
  function setSideAt(i: number, s: Slot) {
    setSide((prev) => prev.map((x, idx) => (idx === i ? s : x)));
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero, side }),
      });
      if (res.ok) {
        setStatus("done");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Banner chính (slide trang chủ)
        </h2>
        <p className="mb-5 text-[13px] text-muted">
          Tỉ lệ khuyến nghị: ngang ~1200×380. Slot có ảnh sẽ thay hình minh hoạ
          mặc định; để trống hết thì trang chủ dùng banner mặc định.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hero.map((slot, i) => (
            <SlotEditor
              key={i}
              label={`Slide ${i + 1}`}
              ratio="aspect-[1200/380]"
              slot={slot}
              onChange={(s) => setHeroAt(i, s)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-[15px] font-bold text-ink">
          Banner treo 2 bên
        </h2>
        <p className="mb-5 text-[13px] text-muted">
          Tỉ lệ khuyến nghị: dọc ~150×430. Chỉ hiện trên màn hình rất rộng.
        </p>
        <div className="grid grid-cols-2 gap-6 sm:max-w-md">
          <SlotEditor
            label="Bên trái"
            ratio="aspect-[150/430]"
            slot={side[0]}
            onChange={(s) => setSideAt(0, s)}
          />
          <SlotEditor
            label="Bên phải"
            ratio="aspect-[150/430]"
            slot={side[1]}
            onChange={(s) => setSideAt(1, s)}
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="h-11 rounded-xl bg-gradient-to-r from-green-d to-green px-6 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(21,154,72,.25)] transition hover:shadow-[0_6px_16px_rgba(21,154,72,.38)] disabled:opacity-60"
        >
          {status === "saving" ? "Đang lưu…" : "Lưu banner"}
        </button>
        {status === "done" && (
          <span className="text-[13px] font-medium text-green-d">
            Đã lưu! Trang chủ sẽ cập nhật sau ít phút.
          </span>
        )}
        {status === "error" && (
          <span className="text-[13px] font-medium text-sale">
            Lưu thất bại, thử lại.
          </span>
        )}
      </div>
    </div>
  );
}
