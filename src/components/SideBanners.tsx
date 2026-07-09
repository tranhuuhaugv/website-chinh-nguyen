"use client";

import { useState } from "react";
import Link from "next/link";
import type { BannerAccent, SideBanner } from "@/lib/types";
import { CloseIcon } from "./icons";

// Banner treo dọc 2 bên trang. Chỉ hiện khi màn hình đủ rộng (>=1560px) để không
// đè lên nội dung (khung giữa 1200px). Có nút đóng. Client Component vì cần state đóng.

const GRADIENT: Record<BannerAccent, string> = {
  green: "bg-[linear-gradient(160deg,#159A48,#0B5E2C)]",
  blue: "bg-[linear-gradient(160deg,#1E5FA8,#123E70)]",
  purple: "bg-[linear-gradient(160deg,#6D3FB0,#3F2470)]",
};

function SideSlot({
  banner,
  side,
  onClose,
}: {
  banner: SideBanner;
  side: "left" | "right";
  onClose: () => void;
}) {
  return (
    <aside
      className={`fixed top-[130px] z-40 hidden w-[150px] min-[1560px]:block ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng banner"
          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-ink-2 shadow transition hover:text-ink"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
        <Link
          href={banner.href}
          className={`flex h-[430px] flex-col justify-end rounded-xl p-4 text-white shadow-lg transition hover:brightness-105 ${
            GRADIENT[banner.accent]
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wide text-white/80">
            Ưu đãi
          </span>
          <b className="mt-1 block text-lg font-bold leading-tight">
            {banner.title}
          </b>
          {banner.subtitle && (
            <p className="mt-1 text-[12.5px] text-white/85">{banner.subtitle}</p>
          )}
          <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
            Xem ngay →
          </span>
        </Link>
      </div>
    </aside>
  );
}

export function SideBanners({
  left,
  right,
}: {
  left: SideBanner;
  right: SideBanner;
}) {
  const [hidden, setHidden] = useState({ left: false, right: false });

  return (
    <>
      {!hidden.left && (
        <SideSlot
          banner={left}
          side="left"
          onClose={() => setHidden((h) => ({ ...h, left: true }))}
        />
      )}
      {!hidden.right && (
        <SideSlot
          banner={right}
          side="right"
          onClose={() => setHidden((h) => ({ ...h, right: true }))}
        />
      )}
    </>
  );
}
